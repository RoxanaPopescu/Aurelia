import os from "os";
import WebpackDevServer from "webpack-dev-server";
import { ErrorWithDetails, Format } from "../helpers";

/**
 * Called when the server is ready, logging server info to the console, and optionally opening the browser.
 * Note that this will kill the process if the server failed to start.
 * @param serverConfig The config used for the compilation.
 * @param error The error that occurred, if the server failed.
 */
export function serverCallback(serverConfig: WebpackDevServer.Configuration, error?: ErrorWithDetails): void
{
    if (error == null)
    {
        const protocol = serverConfig.https ? "https" : "http";
        const localUrl = `${protocol}://localhost:${serverConfig.port}`;

        if ((serverConfig as any).allowedHosts === "all")
        {
            const publicUrl = `${protocol}://${os.hostname().toLowerCase()}:${serverConfig.port}`;

            // Log the host at which the server can be accessed.
            console.log(`${Format.info("i")} Server listening on ${Format.info(localUrl)} and ${Format.info(publicUrl)}`);
        }
        else
        {
            // Log the host at which the server can be accessed.
            console.log(`${Format.info("i")} Server listening on ${Format.info(localUrl)}`);
        }
    }
    else
    {
        // Log the error.
        console.error(error);

        // Log error details, if available.
        if (error.details)
        {
            console.error(error.details);
        }

        console.error(`\n${Format.negative("Server failed")}`);

        // Indicate that the process failed.
        process.exitCode = 1;
    }
}
