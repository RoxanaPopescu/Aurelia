import path from "path";
import pkgDir from "pkg-dir";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { environment } from "../env";

// The default locale code to serve for, if not specified in the request.
const defaultLocaleCode = "en-US";

// The secret debug token, which if present in the `x-debug-token` header,
// enables serving of otherwise protected content, such as source maps.
const debugToken = "not-to-be-shared";

// The path for the root of the package, resolved from within the `artifacts`folder.
const packageFolderPath = pkgDir.sync()!;

// The path for the localized `build` artifact copied from the `frontend` package.
const clientFolderPath = path.join(packageFolderPath, "artifacts/build/client");

// The path for the `static` folder containing publicly available files.
const staticFolderPath = path.join(packageFolderPath, "static");

// The port to which the server should bind.
const port = parseInt(process.env.PORT || "8080");

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

        // Rewrite the request based on the `locale-code` cookie, to serve from the localized build.
        this._app.get("*", (request, response, next) =>
        {
            // tslint:disable-next-line: no-string-literal
            response.locals.localeCode = request.cookies["locale"] || defaultLocaleCode;

            request.url = `/${response.locals.localeCode}${request.url}`;

            next();
        });

        // Serve build artifacts.
        this._app.use(express.static(clientFolderPath));

        // Serve static assets.
        this._app.use(express.static(staticFolderPath));

        // Serve the localized `index.html` for any page request.
        // We ignore requests where the last path segment contains a `.`, as those are requests for files that do not exist.
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
        this._app.listen(port, () =>
        {
            console.info(`Server running in '${environment.name}' environment, listening on port ${port}`);
        });
    }
}
