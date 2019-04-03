import commander from "commander";
import { paths } from "../paths";
import { ICompilerOptions, compile } from "../webpack/compile";

commander

    .option("-e, --environment [development, preview, production]",
        "the target environment",
        "development")

    .option("-p, --platform [cloud, desktop]",
        "the target platform ",
        "cloud")

    .option("-l, --locale [en-US, x-pseudo, da-DK]",
        "the target locale ",
        "en-US")

    .parse(process.argv);

const compilerOptions: ICompilerOptions =
{
    watch: false,
    analyze: true,
    environment:
    {
        name: commander.environment,
        platform: commander.platform,
        locale: commander.locale,
        stubs: true,
        debug: false,
        optimize: true,
        obfuscate: false,

        // Platform-specific configuration.

        ...
        commander.platform === "cloud" ?
        {
            pushState: true,
            publicPath: "./",
            appBaseUrl: "/",
            apiBaseUrl: "/api/"
        } :
        commander.platform === "desktop" ?
        {
            pushState: false,
            publicPath: paths.artifacts.desktopClientBuildFolder,
            appBaseUrl: "",
            apiBaseUrl: "http://localhost:8008/"
        } :
        {} as never,

        // Environment-specific configuration.

        integrations:
        {
            googleMaps:
            {
                key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
            },

            ...
            commander.environment === "production" ?
            {
                googleAnalytics:
                {
                    id: "TODO"
                },
                sentry:
                {
                    dsn: "TODO"
                }
            } :
            {}
        }
    }
};

// tslint:disable-next-line: no-floating-promises
compile(compilerOptions);
