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

    .option("-l, --locale [en-US, x-pseudo, da]",
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

        ...
        commander.environment === "production" ?
        {
            integrations:
            {
                googleMaps:
                {
                    key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
                },

                sentry:
                {
                    dsn: "https://e1c6cac2640e4683b490730936816c46@sentry.io/1430333"
                }
            }
        } :
        {
            integrations:
            {
                googleMaps:
                {
                    key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
                }
            }
        }
    }
};

// tslint:disable-next-line: no-floating-promises
compile(compilerOptions);
