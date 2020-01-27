import WebpackDevServer from "webpack-dev-server";
import { Format } from "../helpers";

// tslint:disable:no-require-imports no-var-requires
const open = require("open");

/**
 * Called when the server is ready, logging server info to the console, and optionally opening the browser.
 * Note that this will kill the process if the server failed to start.
 * @param serverConfig The config used for the compilation.
 * @param error The error that occurred, if the server failed.
 */
export function serverCallback(serverConfig: WebpackDevServer.Configuration, error?: Error): void
{
    if (error == null)
    {
        const protocol = serverConfig.https ? "https" : "http";

        const host = `${protocol}://${serverConfig.host}:${serverConfig.port}`;

        // Log the host at which the server can be accessed.
        console.log(`${Format.info("i")} Server listening on ${Format.info(host)}`);

        // Open the browser, if enabled.
        if (serverConfig.open)
        {
            open(host).catch(() =>
            {
                console.warn(`\n${Format.attention("warn")} Unable to open browser`);
            });
        }
    }
    else
    {
        // Log the error.
        console.error(error);
        console.error(`\n${Format.negative("Server failed")}`);

        // Indicate that the process failed.
        process.exitCode = 1;
    }
}
