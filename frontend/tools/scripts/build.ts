import { program } from "commander";
import { ICompilerOptions, compile } from "../webpack/compile";

const options = program

    .option("--environment [development, preview, production]",
        "The target environment",
        "development")

    .option("--platform [cloud, desktop]",
        "The target platform",
        "cloud")

    .option("--locale [en-US, en-US-x-pseudo, ...]",
        "The target locale",
        "en-US")

    .option("--api <url>",
        "The base URL to use for API requests")

    .option("--commit <sha>",
        "The SHA identifying the commit being built")

    .parse(process.argv).opts();

const compilerOptions: ICompilerOptions =
{
    watch: false,
    analyze: true,
    environment:
    {
        commit: options.commit,

        name: options.environment,
        platform: options.platform,
        locale: options.locale,

        // Platform-specific configuration.

        ...
        options.platform === "cloud" ?
        {
            publicPath: "/",
            appBasePath: "/",
            apiBaseUrl: options.api || "/api/",
            pushState: true
        }
        :
        options.platform === "desktop" ?
        {
            publicPath: "/",
            appBasePath: "/",
            apiBaseUrl: options.api || "http://localhost:8008/api/",
            pushState: false
        }
        :
        {} as never,

        // Environment-specific configuration.

        ...
        options.environment === "development" ?
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
        options.environment === "preview" ?
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
                },

                sentry:
                {
                    dsn: "https://e1c6cac2640e4683b490730936816c46@sentry.io/1430333",
                    eventUrlPattern: "https://sentry.io/organizations/mover-systems-aps/issues/?project=1430333&query={id}"
                }
            }
        }
        :
        options.environment === "production" ?
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

                serviceDesk:
                {
                    dataKey: "44a9c1c9-7485-4450-80b1-c5d3fe1eafe9"
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
