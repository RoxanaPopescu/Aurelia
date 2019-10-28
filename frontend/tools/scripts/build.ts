import commander from "commander";
import { paths } from "../paths";
import { ICompilerOptions, compile } from "../webpack/compile";

commander

    .option("--environment [development, preview, production]",
        "The target environment",
        "development")

    .option("--platform [cloud, desktop]",
        "The target platform",
        "cloud")

    .option("--locale [en-US, x-pseudo]",
        "The target locale",
        "en-US")

    .option("--api <url>",
        "The base URL to use for API requests")

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

        // Platform-specific configuration.

        ...
        commander.platform === "cloud" ?
        {
            pushState: true,
            publicPath: "./",
            appBaseUrl: "/",
            apiBaseUrl: commander.api || "/api/"
        }
        :
        commander.platform === "desktop" ?
        {
            pushState: false,
            publicPath: paths.artifacts.desktopClientBuildFolder,
            appBaseUrl: "",
            apiBaseUrl: commander.api || "http://localhost:8008/"
        }
        :
        {} as never,

        // Environment-specific configuration.

        ...
        commander.environment === "development" ?
        {
            debug: false,
            stubs: true,
            optimize: true,
            obfuscate: false,
            integrations:
            {
                googleMaps:
                {
                    key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
                }
            }
        }
        :
        commander.environment === "preview" ?
        {
            debug: false,
            stubs: false,
            optimize: true,
            obfuscate: false,
            integrations:
            {
                googleMaps:
                {
                    key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
                }
            }
        }
        :
        commander.environment === "production" ?
        {
            debug: false,
            stubs: false,
            optimize: true,
            obfuscate: false,
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
        }
        :
        {} as never
    }
};

// tslint:disable-next-line: no-floating-promises
compile(compilerOptions);
