import WebpackDevServer from "webpack-dev-server";
import webpack from "webpack";
import { logTaskInfo } from "../helpers";
import { ICompilerOptions } from "../compile/compiler-options";
import { getCompilerConfig } from "../compile/compiler-config";
import { IServerOptions } from "./server-options";
import { getServerConfig } from "./server-config";
import { serverCallback } from "./server-callback";

/**
 * Runs the Webpack server.
 * @param compilerOptions The compiler options.
 * @param serverOptions The server options.
 * @returns A promise that will be resolved when the server is listening, or rejected if an error occurs.
 */
export async function serve(compilerOptions: ICompilerOptions, serverOptions: IServerOptions): Promise<void>
{
    logTaskInfo(compilerOptions);

    return new Promise<void>((resolve, reject) =>
    {
        // Get the Webpack compiler config.
        const compilerConfig = getCompilerConfig(compilerOptions);

        // Get the `app` entry point array.
        const appEntryPoint = (compilerConfig.entry as webpack.Entry).app as string[];

        // Add the client module for the server to the `app` entry.
        appEntryPoint.unshift("webpack-dev-server/client");

        // Add the hot reload module for the server to the `app` entry point, if enabled.
        if (serverOptions.hmr)
        {
            compilerConfig.plugins!.push(new webpack.HotModuleReplacementPlugin());
            appEntryPoint.unshift("webpack/hot/dev-server");
        }

        // Create the Webpack compiler.
        const compiler = webpack(compilerConfig);

        // Log an empty line after each compilation, to make the console less cluttered.
        compiler.hooks.done.tap("done", () => console.log());

        // Get the Webpack server config.
        const serverConfig = getServerConfig(compilerConfig, serverOptions);

        // Create the Webpack server.
        const server = new WebpackDevServer(compiler, serverConfig);

        // Start the server.
        server.listen(serverConfig.port!, serverConfig.host!, (error?: Error) =>
        {
            // Log server info to console, and if enabled, open the browser.
            serverCallback(error, serverConfig);

            resolve();
        });
    });
}
