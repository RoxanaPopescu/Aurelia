// tslint:disable: no-string-literal

import path from "path";
import pkgDir from "pkg-dir";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import settings from "../resources/settings";
import { environment } from "../env";

// The secret debug token, which if present in the `x-debug-token` header,
// enables serving of otherwise protected content, such as source maps.
const debugToken = "not-to-be-shared";

// The path for the root of the package, resolved from within the `artifacts`folder.
const packageFolderPath = pkgDir.sync()!;

// The path for the localized `build` artifact copied from the `frontend` package.
const clientFolderPath = path.join(packageFolderPath, "artifacts/build/client");

// The path for the `static` folder containing publicly available files.
const staticFolderPath = path.join(packageFolderPath, "static");

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

        // Remove the 'x-powered-by' header.
        this._app.disable("x-powered-by");

        // Always trust the first value in 'X-Forwarded-*' headers, so requests contain the original
        // client IP address and request protocol, host and port, even when hosted behind proxies.
        // Note that this does not prevent the client from spoofing this information.
        this._app.enable("trust proxy");

        // Configure server plugins.
        this._app.use(compression());
        this._app.use(cookieParser());

        // Protect sensitive resources, if enabled for the environment.
        if (environment.protect)
        {
            this._app.get(/^[/]debug$|\.map$/i, (request, response, next) =>
            {
                if (request.header("x-debug-token") === debugToken)
                {
                    next();
                }
                else
                {
                    response.status(403).send("Forbidden");
                }
            });
        }

        // Handle requests for debug info.
        this._app.get(/^[/]debug$/i, (request, response) =>
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
        this._app.get("*", (request, response, next) =>
        {
            // Get the settings for the hostname specified in the request.

            const hostSettings = settings.hosts.find(s => s.hostname.test(request.hostname));

            if (hostSettings == null)
            {
                throw new Error(`No settings found for the hostname '${request.hostname}'.`);
            }

            // Resolve the theme to use, ensure the cookie is set,
            // and rewrite the request to serve the correct resources.

            const themeSlugFromCookie = request.cookies["theme"];
            response.locals.themeSlug = themeSlugFromCookie || hostSettings.themeSlug;

            if (!themeSlugFromCookie)
            {
                response.cookie("theme", response.locals.themeSlug);
            }

            request.url = request.url.replace(
                /^\/resources\/themes\/default\//,
                `/resources/themes/${response.locals.themeSlug}/`);

            // Resolve the locale to use, ensure the cookie is set,
            // and rewrite the request so we serve the correct build.

            const localeCodeFromCookie = request.cookies["locale"];
            response.locals.localeCode = localeCodeFromCookie || hostSettings.localeCode;

            if (!localeCodeFromCookie)
            {
                response.cookie("locale", response.locals.localeCode);
            }

            request.url = `/${response.locals.localeCode}${request.url}`;

            // Resolve the currency to use and ensure the cookie is set.

            const currencyCodeFromCookie = request.cookies["currency"];
            response.locals.currencyCode = currencyCodeFromCookie || hostSettings.currencyCode;

            if (!currencyCodeFromCookie)
            {
                response.cookie("currency", response.locals.currencyCode);
            }

            next();
        });

        // Serve build artifacts.
        this._app.use(express.static(clientFolderPath,
        {
            index: false,
            redirect: false
        }));

        // Serve static assets.
        this._app.use(express.static(staticFolderPath,
        {
            index: false,
            redirect: false
        }));

        // Serve the localized `index.html` for any page request.
        // We ignore requests where the last path segment contains a `.`, as those are for files that do not exist.
        this._app.get(/(^|\/)[^/.]*$/i, (request, response) =>
        {
            const indexFilePath = path.join(clientFolderPath, response.locals.localeCode, "index.html");

            response.sendFile(indexFilePath);
        });
    }

    private readonly _app: express.Express;

    /**
     * Starts the app.
     */
    public start(): void
    {
        // Start the server.
        this._app.listen(environment.port, () =>
        {
            console.info(`Server running in '${environment.name}' environment, listening on port ${environment.port}`);
        });
    }
}
