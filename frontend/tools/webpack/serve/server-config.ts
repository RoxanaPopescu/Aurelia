import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import { IServerOptions } from "./server-options";
import { paths } from "../../paths";
import { Format } from "../helpers";

/**
 * Creates a Webpack server config based on the specified options.
 * @param compilerConfig The compiler config.
 * @param serverOptions The server options.
 * @returns The server config.
 */
export function getServerConfig(compilerConfig: webpack.Configuration, serverOptions: IServerOptions): WebpackDevServer.Configuration
{
    const config: WebpackDevServer.Configuration =
    {
        // Configure host and host check.
        ...serverOptions.public ?
        {
            host: "0.0.0.0",
            disableHostCheck: true
        } :
        {
            host: "localhost"
        },

        // Configure server.
        port: serverOptions.port,
        hot: serverOptions.hmr,
        open: serverOptions.open,
        proxy: serverOptions.proxy,
        publicPath: compilerConfig.output!.publicPath,
        historyApiFallback: true,
        compress: true,
        contentBase:
        [
            // HACK: Disabled because it would break hot module replacement.
            // Once we remove of the legacy folder, we can disable `watchContentBase` and re-enable this.
            // paths.srcFolder,

            paths.staticFolder,
            paths.legacyFolder
        ],
        watchContentBase: true,

        // Configure logging.
        clientLogLevel: "none",
        overlay: true,
        noInfo: true,
        stats:
        {
            version: false,
            timings: false,
            hash: false,
            assets: false,
            entrypoints: false,
            modules: false,
            children: false,

            colors: Format.supportsColor
        }
    };

    return config;
}
