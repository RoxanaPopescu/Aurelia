import WebpackDevServer from "webpack-dev-server";
import { Format } from "../helpers";

// tslint:disable:no-require-imports no-var-requires
const open = require("opn");

/**
 * Called when the server is ready, to log server info to the console, and optionally open the browser.
 * Note that this will kill the process if the server failed to start.
 * @param compilerConfig The config used for the compilation.
 */
export function serverCallback(error: Error | undefined, compilerConfig: WebpackDevServer.Configuration): void
{
    if (error == null)
    {
        const protocol = compilerConfig.https ? "https" : "http";

        const host = compilerConfig.public
            ? `${protocol}://${compilerConfig.public}`
            : `${protocol}://${compilerConfig.host}:${compilerConfig.port}`;

        // Log the host at which the server can be accessed.
        console.log(`${Format.info("i")} Server listening on ${Format.info(host)}`);
        console.log(`${Format.info(" ")} Waiting for compilation to complete...`);

        // Open the browser, if enabled.
        if (compilerConfig.open)
        {
            open(host).catch(() =>
            {
                console.warn(`${Format.warn("warn")} Unable to open browser`);
            });
        }
    }
    else
    {
        // Log error and kill the process.
        console.error(error);
        process.exit(1);
    }
}
