import commander from "commander";
import { ICompilerOptions, compile } from "../webpack/compile";

commander

    .option("--environment [development, preview, production]",
        "The target environment",
        "development")

    .option("--platform [cloud, desktop]",
        "The target platform",
        "cloud")

    .option("--locale [en-US, en-US-x-pseudo]",
        "The target locale",
        "en-US")

    .option("--api <url>",
        "The base URL to use for API requests")

    .option("--commit <sha>",
        "The SHA identifying the commit being built")

    .parse(process.argv);

const compilerOptions: ICompilerOptions =
{
    watch: false,
    analyze: true,
    environment:
    {
        commit: commander.commit,

        name: commander.environment,
        platform: commander.platform,
        locale: commander.locale,

        // Platform-specific configuration.

        ...
        commander.platform === "cloud" ?
        {
            publicPath: "/",
            appBaseUrl: "/",
            apiBaseUrl: commander.api || "/api/",
            pushState: true
        }
        :
        commander.platform === "desktop" ?
        {
            publicPath: "/",
            appBaseUrl: "/",
            apiBaseUrl: commander.api || "http://localhost:8008/",
            pushState: true
        }
        :
        {} as never,

        // Environment-specific configuration.

        ...
        commander.environment === "development" ?
        {
            debug: true,
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
                },

                sentry:
                {
                    dsn: "https://e1c6cac2640e4683b490730936816c46@sentry.io/1430333",
                    eventUrlPattern: "https://sentry.io/organizations/mover-systems-aps/issues/?project=1430333&query={id}"
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
                googleTagManager:
                {
                    dataLayerId: "GTM-TDRC52X"
                },

                googleMaps:
                {
                    key: "AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs"
                },

                sentry:
                {
                    dsn: "https://e1c6cac2640e4683b490730936816c46@sentry.io/1430333",
                    eventUrlPattern: undefined
                }
            }
        }
        :
        {} as never
    }
};

// tslint:disable-next-line: no-floating-promises
compile(compilerOptions);
