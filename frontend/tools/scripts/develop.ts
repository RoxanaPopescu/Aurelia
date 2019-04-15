import commander from "commander";
import { ICompilerOptions } from "../webpack/compile";
import { IServerOptions, serve } from "../webpack/serve";

commander

    .option("-e, --environment [development, preview, production]",
        "the target environment",
        "development")

    .option("-l, --locale [en-US, x-pseudo, da]",
        "the target locale ",
        "en-US")

    .parse(process.argv);

const compilerOptions: ICompilerOptions =
{
    watch: true,
    analyze: false,
    environment:
    {
        name: commander.environment,
        platform: "cloud",
        locale: commander.locale,
        stubs: true,
        debug: true,
        optimize: false,
        obfuscate: false,

        // Platform-specific configuration.

        pushState: true,
        publicPath: "./",
        appBaseUrl: "/",
        apiBaseUrl: "/api/",

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

const serveOptions: IServerOptions =
{
    port: 8080,
    open: false,
    hmr: true,
    proxy:
    {
        "/api/": "http://localhost:8008/"
    }
};

// tslint:disable-next-line: no-floating-promises
serve(compilerOptions, serveOptions);
