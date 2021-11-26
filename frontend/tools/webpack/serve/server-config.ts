import path from "path";
import WebpackDevServer from "webpack-dev-server";
import { paths } from "../../paths";
import { Format } from "../helpers";
import { ICompilerOptions } from "../compile";
import { IServerOptions } from "./server-options";

/**
 * Creates a Webpack server config based on the specified options.
 * @param compilerOptions The compiler options.
 * @param serverOptions The server options.
 * @returns The server config.
 */
export function getServerConfig(compilerOptions: ICompilerOptions, serverOptions: IServerOptions): WebpackDevServer.Configuration
{
    const config: WebpackDevServer.Configuration =
    {
        // Configure host and host check.
        ...
        serverOptions.public ?
        {
            allowedHosts: "all",
            host: "0.0.0.0"
        }
        :
        {
            allowedHosts: "auto",
            host: "localhost"
        },

        // Configure server options.
        port: serverOptions.port,
        hot: serverOptions.hot,
        open: serverOptions.open,
        proxy: serverOptions.proxy,

        // Configure custom middleware.
        onBeforeSetupMiddleware: (devServer: any) =>
        {
            // HACK: Prevent unwanted redirects.
            devServer.app.use(preventDirectoryRedirect);
        },

        // Configure dev middleware.
        devMiddleware:
        {
            publicPath: compilerOptions.environment.publicPath,
            stats:
            {
                all: false,
                errors: true,
                warnings: true,
                logging: "warn",
                colors: Format.supportsColor
            }
        },

        // Configure static middleware.
        static:
        [
            {
                directory: paths.srcFolder,
                publicPath: compilerOptions.environment.publicPath,
                serveIndex: false,
                watch: false
            },
            {
                directory: paths.staticFolder,
                publicPath: compilerOptions.environment.publicPath,
                serveIndex: false,
                watch: false
            }
        ],

        // Configure fallback middleware.
        historyApiFallback:
        {
            index: path.resolve(compilerOptions.environment.publicPath, "index.html")
        },

        // Configure client integration.
        client:
        {
            logging: "warn",
            overlay: { errors: true, warnings: false },
        },

    } as any;

    return config;
}

/**
 * Ensures a trailing slash is added to `request.url`, thereby preventing the
 * static files middleware from returning an unwanted permanent redirect.
 */
function preventDirectoryRedirect(req: any, res: any, next: any): any
{
    // The URL already ends with a `/`.
    if (req.url.endsWith("/"))
    {
        return next();
    }

    // The URL appears to reference a file.
    if (/.+\..+$/.test(req.url))
    {
        return next();
    }

    // The URL appears to reference a directory, so we append a `/`.
    req.originalUrl += "/";
    req.url += "/";

    return next();
}
