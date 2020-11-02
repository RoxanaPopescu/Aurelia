import fs from "fs";
import path from "path";
import pkgDir from "pkg-dir";
import http from "http";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import prerenderNode from "prerender-node";
import acceptLanguage from "accept-language";
import { DateTime } from "luxon";
import { environment } from "../env";
import settings from "../resources/settings";

// The path for the root of the package, resolved from within the `artifacts`folder.
const packageFolderPath = pkgDir.sync()!;

// The path for the folder containing the localized `build` artifacts copied from the `frontend` package.
const frontendFolderPath = path.join(packageFolderPath, "artifacts/build/frontend");

// The path for the `static` folder containing publicly available files.
const staticFolderPath = path.join(packageFolderPath, "static");

// Get the locale codes for which localized builds exist.
const supportedLocaleCodes = fs.readdirSync(frontendFolderPath)
    .filter(name => fs.lstatSync(path.join(frontendFolderPath, name)).isDirectory());

// Set the supported locale codes.
acceptLanguage.languages([null as any, ...supportedLocaleCodes]);

/**
 * Represents the app.
 */
export class App
{
    /**
     * Creates a new instance of the type.
     */
    public constructor()
    {
        // Create the server.
        this._app = express();

        // Remove the `x-powered-by` header.
        this._app.disable("x-powered-by");

        // Always trust the first value in `x-forwarded-*` headers, so requests contain the original
        // client IP address and request protocol, host and port, even when hosted behind proxies.
        // Note that this does not prevent the client from spoofing this information.
        this._app.enable("trust proxy");

        // Configure server middleware.
        this._app.use(compression());
        this._app.use(cookieParser());

        // Configure prerender middleware.
        prerenderNode.set("prerenderToken", settings.prerender.serviceToken);
        prerenderNode.set("prerenderServiceUrl", settings.prerender.serviceUrl);
        this._app.use(prerenderNode);

        // Create and mount the router.
        this._router = express.Router();
        this._app.use(environment.baseUrl, this._router);

        // Protect sensitive resources, if enabled for the environment.
        if (environment.protect)
        {
            this._router.get(/^\/debug$|\.map$/i, (request, response, next) =>
            {
                const debugToken = request.header("x-debug-token") || request.cookies["debug-token"];

                if (settings.app.debugToken && debugToken === settings.app.debugToken)
                {
                    next();
                }
                else
                {
                    response.sendStatus(403);
                }
            });
        }

        // Handle requests for debug info.
        this._router.get(/^\/debug$/i, (request, response) =>
        {
            response.json(
            {
                "environment": environment.name,
                "request":
                {
                    "method": request.method,
                    "url": request.originalUrl,
                    "headers": request.headers
                }
            });
        });

        // Handle requests for health info.
        this._router.get(/^\/health$/i, (request, response) =>
        {
            response.sendStatus(200);
        });

        // Serve static files.
        this._router.use(express.static(staticFolderPath,
        {
            index: false,
            redirect: false,
            maxAge: settings.app.maxAge.static.valueOf()
        }));

        // Resolve host settings, set cookies, and rewrite the request.
        this._router.use((request, response, next) =>
        {
            const context = new RequestContext(request);
            response.locals.context = context;

            // Rewrite requests without a locale in the path, to to use the resolved locale code.
            if (!context.localeCodeInPath)
            {
                context.preventCaching = true;

                request.url = `/${context.supportedLocaleCode}${request.url}`;
            }

            // Ensure the `currency` cookie is set.
            if (!context.currencyCodeInCookie)
            {
                response.cookie("currency", context.requestedCurrencyCode, { encode: s => s });
            }

            // Ensure the `theme` cookie is set.
            if (!context.themeSlugInCookie && !context.themeSlugInPath)
            {
                response.cookie("theme", context.requestedThemeSlug, { encode: s => s });
            }

            // Rewrite requests for theme resources, to use the resolved theme slug.
            if (!context.themeSlugInPath)
            {
                request.url = request.url.replace(/\/resources\/theme\//, () =>
                {
                    context.preventCaching = true;

                    const themeVariant = context.prefersColorScheme ?? "light";
                    const themeSlug = context.requestedThemeSlug.replace("{variant}", themeVariant);

                    return `/resources/themes/${themeSlug}/`;
                });
            }

            // tslint:enable

            next();
        });

        // Serve build artifacts.
        this._router.use(express.static(frontendFolderPath,
        {
            index: false,
            redirect: false,
            maxAge: settings.app.maxAge.artifact.valueOf(),
            setHeaders: response =>
            {
                const context = response.locals.context as RequestContext;

                if (context.preventCaching)
                {
                    response.setHeader("cache-control", "public, max-age=0");
                }
            }
        }));

        // Handle requests from unsupported browsers.
        this._router.use((request, response, next) =>
        {
            if ((request.method === "GET" || request.method === "HEAD") && request.accepts("text/html"))
            {
                const isUnsupportedBrowser = /msie|trident|edge/i.test(request.headers["user-agent"] ?? "");
                const allowUnsupportedBrowser = "unsupported" in request.query;

                if (isUnsupportedBrowser && !allowUnsupportedBrowser)
                {
                    const context = response.locals.context as RequestContext;

                    response.status(503);
                    response.sendFile("unsupported/index.html",
                    {
                        root: staticFolderPath,
                        maxAge: context.preventCaching ? 0 : settings.app.maxAge.static.valueOf()
                    },
                    error => error && next(error));

                    return;
                }
            }

            next();
        });

        // Serve the localized `index.html` file for any page request.
        this._router.use((request, response, next) =>
        {
            if ((request.method === "GET" || request.method === "HEAD") && request.accepts("text/html"))
            {
                const context = response.locals.context as RequestContext;

                if (context.supportedLocaleCode != null)
                {
                    response.sendFile(path.join(context.supportedLocaleCode, "index.html"),
                    {
                        root: frontendFolderPath,
                        maxAge: context.preventCaching ? 0 : settings.app.maxAge.index.valueOf()

                    }, error => error && next(error));
                }
                else
                {
                    response.status(503);

                    const localeCookie =
                    `
                        locale=${context.localeCodeInConfig};
                        path=${environment.baseUrl};
                        expires=${DateTime.utc().plus({ years: 10 }).toHTTP()}
                    `;

                    response.send(
                    `
                        This site is unavailable in the language <code>${context.requestedLocaleCode}</code> —
                        <a href="javascript: document.cookie='${localeCookie}'; location.reload();">
                            try <code>${context.localeCodeInConfig.toLowerCase()}</code> instead
                        </a>
                    `);
                }
            }
            else
            {
                next();
            }
        });
    }

    private readonly _app: express.Express;
    private readonly _router: express.Router;
    private _server: http.Server | undefined;

    /**
     * Starts the app.
     */
    public start(): void
    {
        // Start the server.
        this._server = this._app.listen(environment.port, () =>
        {
            console.info(
                `Server running in environment '${environment.name}', ` +
                `listening on port ${environment.port}, ` +
                `using base path '${environment.baseUrl}'`);
        });
    }

    /**
     * Stop the app.
     */
    public stop(): void
    {
        if (this._server != null)
        {
            // Stop the server.
            this._server.close(() =>
            {
                this._server = undefined;

                console.info("Server stopped");
            });
        }
    }
}

/**
 * Represents the context associated with the request.
 */
class RequestContext
{
    /**
     * Creates a new instance of the type.
     * @param request The request currently being handled.
     */
    public constructor(request: express.Request)
    {
        // Get the settings for the hostname specified in the request.

        const hostSettings = settings.hosts.find(s => s.hostname.test(request.hostname));

        if (hostSettings == null)
        {
            throw new Error(`No settings found for the hostname '${request.hostname}'.`);
        }

        // tslint:disable: no-string-literal

        // Resolve the locale to use.

        this.localeCodeInCookie = request.cookies["locale"];
        this.localeCodeInPath = request.path.match(/^\/([a-z]{2}(?:-[a-z0-9]+)*)(?:\/|$)/i)?.[1];
        this.localeCodeInHeader = acceptLanguage.get(request.header("accept-language")) ?? undefined;
        this.localeCodeInConfig = hostSettings.localeCode;

        this.requestedLocaleCode = (this.localeCodeInCookie || this.localeCodeInPath || this.localeCodeInHeader || this.localeCodeInConfig).toLowerCase();
        this.supportedLocaleCode = supportedLocaleCodes.find(l => l.toLowerCase() === this.requestedLocaleCode);

        if (!this.supportedLocaleCode && this.localeCodeInCookie)
        {
            this.supportedLocaleCode =
                supportedLocaleCodes.find(l => l.toLowerCase() === this.localeCodeInPath?.toLowerCase()) ||
                supportedLocaleCodes.find(l => l.toLowerCase() === this.localeCodeInHeader?.toLowerCase()) ||
                supportedLocaleCodes.find(l => l.toLowerCase() === this.localeCodeInConfig?.toLowerCase());
        }

        // Resolve the currency to use.

        this.currencyCodeInCookie = request.cookies["currency"];
        this.currencyCodeInConfig = hostSettings.currencyCode;

        this.requestedCurrencyCode = (this.currencyCodeInCookie || this.currencyCodeInConfig).toUpperCase();

        // Resolve the theme to use.

        this.themeSlugInPath = request.path.match(/\/resources\/themes\/([^/]+)\//i)?.[1];
        this.themeSlugInCookie = request.cookies["theme"];
        this.themeSlugInConfig = hostSettings.themeSlug;

        this.requestedThemeSlug = (this.themeSlugInPath || this.themeSlugInCookie || this.themeSlugInConfig).toLowerCase();

        // Get the color scheme preferred by the user agent.

        this.prefersColorScheme = request.cookies["prefers-color-scheme"];

        // tslint:enable
    }

    /**
     * The locale code specified in the `locale` cookie,
     * or undefined if not specified.
     */
    public readonly localeCodeInCookie: string | undefined;

    /**
     * The locale code specified in the request path,
     * or undefined if not specified.
     */
    public readonly localeCodeInPath: string | undefined;

    /**
     * The locale code specified in the request header, resolved to the best matching supported locale code,
     * or undefined if not specified or if no matching supported locale code was found.
     */
    public readonly localeCodeInHeader: string | undefined;

    /**
     * The locale code specified in the host config for the request.
     */
    public readonly localeCodeInConfig: string;

    /**
     * The requested locale code, determined based on the request and host config.
     */
    public readonly requestedLocaleCode: string;

    /**
     * The supported locale code, determined based on the requested locale code.
     * Note that this may be undefined if no frontend build supports the requested locale code.
     */
    public readonly supportedLocaleCode: string | undefined;

    /**
     * The currency code specified in the request cookie,
     * or undefined if not specified.
     */
    public readonly currencyCodeInCookie: string | undefined;

    /**
     * The currency code specified in the host config for the request.
     */
    public readonly currencyCodeInConfig: string;

    /**
     * The requested currency code, determined based on the request and host config.
     * Note that this is not validated, and could represent an unsupported currency code.
     */
    public readonly requestedCurrencyCode: string;

    /**
     * The theme slug specified in the request path,
     * or undefined if not specified.
     */
    public readonly themeSlugInPath: string | undefined;

    /**
     * The theme slug specified in the request cookie,
     * or undefined if not specified.
     */
    public readonly themeSlugInCookie: string | undefined;

    /**
     * The theme slug specified in the host config for the request.
     */
    public readonly themeSlugInConfig: string;

    /**
     * The requested theme slug, determined based on the request and host config.
     * Note that this is not validated, and could represent an unsupported theme slug.
     */
    public readonly requestedThemeSlug: string;

    /**
     * The color scheme preferred by the user agent,
     * or undefined if not specified.
     */
    public readonly prefersColorScheme: "light" | "dark" | undefined;

    /**
     * True to prevent caching of the response, e.g. because it depends on a
     * cookie or header, otherwise undefined or false.
     */
    public preventCaching: boolean | undefined = undefined;
}
