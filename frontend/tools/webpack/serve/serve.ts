import WebpackDevServer from "webpack-dev-server";
import webpack from "webpack";
import { logBuildInfo } from "../helpers";
import { ICompilerOptions } from "../compile/compiler-options";
import { getCompilerConfig } from "../compile/compiler-config";
import { compilerCallback } from "../compile/compiler-callback";
import { IServerOptions } from "./server-options";
import { getServerConfig } from "./server-config";
import { serverCallback } from "./server-callback";

/**
 * Runs the Webpack server.
 * @param compilerOptions The compiler options.
 * @param serverOptions The server options.
 * @returns A promise that will be resolved when the server is ready, or rejected if an error occurs.
 */
export async function serve(compilerOptions: ICompilerOptions, serverOptions: IServerOptions): Promise<void>
{
    logBuildInfo(compilerOptions);

    return new Promise<void>((resolve, reject) =>
    {
        // Get the Webpack compiler config.
        const compilerConfig = getCompilerConfig(compilerOptions);

        // Create the Webpack compiler.
        const compiler = webpack(compilerConfig);

        // Log the start of each compilation.
        compiler.hooks.compile.tap("compile", () => console.info("\nBuilding...\n"));

        // Log the result of each compilation.
        compiler.hooks.done.tap("done", stats => compilerCallback(compilerOptions, stats, []));

        // Get the Webpack server config.
        const serverConfig = getServerConfig(compilerOptions, serverOptions);

        // Create the Webpack server.
        const server = new WebpackDevServer(serverConfig, compiler);

        // Start the server.
        server.startCallback((error?: Error) =>
        {
            // Log server info to console, and if enabled, open the browser.
            serverCallback(serverConfig, error);

            // Resolve the promise, indicating that the server is ready.
            resolve();
        });
    });
}
