/**
 * Represents the identifiers for the supported cloud environments.
 * The cloud environment is that in which the server runs.
 */
export type CloudEnvironmentName = "development" | "preview" | "production";

/**
 * Represents the environment in which the server runs.
 */
export class CloudEnvironment
{
    public constructor()
    {
        // The default environment to use if `NODE_ENV` is undefined.
        const defaultName = "development";

        // The default port to use if `PORT` is undefined.
        const defaultPort = "8080";

        // Configure environment.
        this.name = (process.env.NODE_ENV || defaultName).trim() as CloudEnvironmentName;
        this.port = parseInt(process.env.PORT || defaultPort);
        this.protect = this.name !== "development";
    }

    /**
     * The name identifying the environment.
     */
    public name: CloudEnvironmentName;

    /**
     * The port to which the server should bind.
     * The default is `8080`.
     */
    public port: number;

    /**
     * True if sensitive resources should be protected, otherwise false.
     * When enabled, sensitive resources will only be served if the request
     * contains the secret `x-debug-token` header.
     * Recommended in the `production` environment.
     */
    public protect: boolean;
}

/**
 * The environment in which the server runs.
 */
export const environment = new CloudEnvironment();
