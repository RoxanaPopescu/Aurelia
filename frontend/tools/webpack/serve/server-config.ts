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
        // Disable host check, despite the security risk.
        // See: https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
        disableHostCheck: true,

        host: "localhost",
        port: serverOptions.port,
        hot: serverOptions.hmr,
        open: serverOptions.open,
        proxy: serverOptions.proxy,

        publicPath: compilerConfig.output!.publicPath,
        filename: compilerConfig.output!.filename,
        contentBase:
        [
            compilerConfig.output!.path!,
            paths.srcFolder,
            paths.staticFolder
        ],
        watchContentBase: true,
        historyApiFallback: true,
        compress: true,
        clientLogLevel: "none",
        overlay: true,
        stats:
        {
            version: false,
            timings: false,
            hash: false,
            assets: false,
            entrypoints: false,
            modules: false,
            children: false,

            // tslint:disable-next-line:no-require-imports
            colors: Format.supportsColor
        }
    };

    return config;
}
