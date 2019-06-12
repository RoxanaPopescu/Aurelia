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
        apiBaseUrl: "/api/",

        // Platform-specific configuration.

        ...
        commander.platform === "cloud" ?
        {
            pushState: true,
            publicPath: "./",
            appBaseUrl: "/"
        } :
        commander.platform === "desktop" ?
        {
            pushState: false,
            publicPath: paths.artifacts.desktopClientBuildFolder,
            appBaseUrl: ""
        } :
        {} as never,

        // Environment-specific configuration.

        ...
        commander.environment === "development" ?
        {
            integrations:
            {
                googleMaps:
                {
                    key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
                }
            }
        } :
        commander.environment === "preview" ?
        {
            integrations:
            {
                googleMaps:
                {
                    key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
                }
            }
        } :
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
        {} as never
    }
};

// tslint:disable-next-line: no-floating-promises
compile(compilerOptions);
