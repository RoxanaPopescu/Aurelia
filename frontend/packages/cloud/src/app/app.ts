import fs from "fs";
import path from "path";
import pkgDir from "pkg-dir";
import http from "http";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
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

        // Handle requests for health info.
        this._router.get(/^\/health$/i, (request, response) =>
        {
            response.sendStatus(200);
        });

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

        // Resolve host settings, set cookies, and rewrite the request.
        this._router.use((request, response, next) =>
        {
            const rl = response.locals;

            // Get the settings for the hostname specified in the request.

            const hostSettings = settings.hosts.find(s => s.hostname.test(request.hostname));

            if (hostSettings == null)
            {
                throw new Error(`No settings found for the hostname '${request.hostname}'.`);
            }

            // tslint:disable: no-string-literal

            // Resolve the locale to use.

            rl.localeCodeInCookie = request.cookies["locale"];
            rl.localeCodeInPath = request.path.match(/^\/([a-z]{2}(?:-[a-z0-9]+)*)(?:\/|$)/i)?.[1];
            rl.localeCodeInHeader = acceptLanguage.get(request.header("Accept-Language"));
            rl.localeCodeInConfig = hostSettings.localeCode;

            rl.requestedLocaleCode = (rl.localeCodeInCookie || rl.localeCodeInPath || rl.localeCodeInHeader || rl.localeCodeInConfig).toLowerCase();
            rl.supportedLocaleCode = supportedLocaleCodes.find(l => l.toLowerCase() === rl.requestedLocaleCode);

            if (!rl.supportedLocaleCode && rl.localeCodeInCookie)
            {
                rl.supportedLocaleCode =
                    supportedLocaleCodes.find(l => l.toLowerCase() === rl.localeCodeInPath?.toLowerCase()) ||
                    supportedLocaleCodes.find(l => l.toLowerCase() === rl.localeCodeInHeader?.toLowerCase()) ||
                    supportedLocaleCodes.find(l => l.toLowerCase() === rl.localeCodeInConfig?.toLowerCase());
            }

            // Rewrite requests without a locale in the path, to to match the resolved locale.

            if (!rl.localeCodeInPath)
            {
                request.url = `/${rl.supportedLocaleCode}${request.url}`;
            }

            // Resolve the currency to use.

            rl.currencyCodeInCookie = request.cookies["currency"];
            rl.currencyCodeInConfig = hostSettings.currencyCode;

            rl.requestedCurrencyCode = (rl.currencyCodeInCookie || rl.currencyCodeInConfig).toUpperCase();

            // Ensure the currency cookie is set.

            if (!rl.currencyCodeInCookie)
            {
                response.cookie("currency", rl.requestedCurrencyCode, { encode: s => s });
            }

            // Resolve the theme to use.

            rl.themeSlugInPath = request.path.match(/\/resources\/themes\/([^/]+)\//i)?.[1];
            rl.themeSlugInCookie = request.cookies["theme"];
            rl.themeSlugInConfig = hostSettings.themeSlug;

            if (rl.themeSlugInPath === "current")
            {
                rl.themeSlugInPath = undefined;
            }

            rl.requestedThemeSlug = (rl.themeSlugInPath || rl.themeSlugInCookie || rl.themeSlugInConfig).toLowerCase();

            // Ensure the theme cookie is set.

            if (!rl.themeSlugInCookie && !rl.themeSlugInPath)
            {
                response.cookie("theme", rl.requestedThemeSlug, { encode: s => s });
            }

            // Rewrite requests for theme resources, to match the resolved theme.

            if (!rl.themeSlugInPath)
            {
                const themeSlug = rl.requestedThemeSlug.replace("{variant}", "light");
                request.url = request.url.replace(/\/resources\/themes\/current\//, `/resources/themes/${themeSlug}/`);
            }

            // tslint:enable

            next();
        });

        // Serve build artifacts.
        this._router.use(express.static(frontendFolderPath,
        {
            index: false,
            redirect: false,
            maxAge: settings.app.maxAge.artifact.valueOf()
        }));

        // Serve static files.
        this._router.use(express.static(staticFolderPath,
        {
            index: false,
            redirect: false,
            maxAge: settings.app.maxAge.static.valueOf()
        }));

        // Handle requests from browsers we do not support.
        this._router.use((request, response, next) =>
        {
            if ((request.method === "GET" || request.method === "HEAD") && request.accepts("text/html"))
            {
                if (/msie|trident|edge/i.test(request.headers["user-agent"] ?? ""))
                {
                    response.status(503);
                    response.sendFile("unsupported/index.html",
                    {
                        root: staticFolderPath,
                        maxAge: settings.app.maxAge.static.valueOf()
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
                const rl = response.locals;

                if (rl.supportedLocaleCode != null)
                {
                    response.sendFile(path.join(rl.supportedLocaleCode, "index.html"),
                    {
                        root: frontendFolderPath,
                        maxAge: settings.app.maxAge.index.valueOf()

                    }, error => error && next(error));
                }
                else
                {
                    response.status(503);

                    const localeCookieExpires = DateTime.utc().plus({ years: 10 }).toHTTP();
                    const localeCookie = `locale=${rl.localeCodeInConfig};path=/;expires=${localeCookieExpires}`;

                    response.send(
                        `This site is unavailable in the language <code>${rl.requestedLocaleCode}</code> —
                        <a href="javascript: document.cookie='${localeCookie}'; location.reload();">
                            try <code>${rl.localeCodeInConfig}</code> instead
                        </a>`);
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
