import commander from "commander";
import { ICompilerOptions } from "../webpack/compile";
import { IServerOptions, serve } from "../webpack/serve";

commander

    .option("--environment [development, preview, production]",
        "The target environment",
        "development")

    .option("--locale [en-US, en-US-x-pseudo]",
        "The target locale",
        "en-US")

    .option("--api <url>",
        "The URL to which API requests should be proxied, including a trailing `/`",
        "https://bff.mover.dev/")

    .option("--port <number>",
        "The port on which the server should listen",
        value => parseInt(value),
        8080)

    .option("--public",
        "Allow connections from any host and any device on the network, despite security risks",
        false)

    .parse(process.argv);

const compilerOptions: ICompilerOptions =
{
    watch: true,
    analyze: false,
    environment:
    {
        commit: undefined,

        name: commander.environment,
        platform: "cloud",
        locale: commander.locale,
        stubs: true,
        debug: true,
        optimize: false,
        obfuscate: false,

        // Platform-specific configuration.

        publicPath: "/",
        appBaseUrl: "/",
        apiBaseUrl: "/api/",
        pushState: true,

        // Environment-specific configuration.

        integrations:
        {
            googleMaps:
            {
                key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
            }
        }
    }
};

const serverOptions: IServerOptions =
{
    port: commander.port,
    open: false,
    hmr: true,
    proxy:
    {
        "/api/":
        {
            pathRewrite: { "^/api/": "" },
            changeOrigin: true,
            target: commander.api,
            secure: false
        }
    },
    public: commander.public
};

// tslint:disable-next-line: no-floating-promises
serve(compilerOptions, serverOptions);
