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
        // The default environment to use if the `NODE_ENV` variable is undefined.
        const defaultName = "development";

        // The default port to use if the `PORT` variable is undefined.
        const defaultPort = "8080";

        // The default base path to use if the `BASE_URL` variable is undefined.
        const defaultBasePath = "/";

        // Configure environment.
        this.name = (process.env.NODE_ENV || defaultName).trim() as CloudEnvironmentName;
        this.port = parseInt(process.env.PORT || defaultPort);
        this.protect = this.name !== "development";
        this.baseUrl = process.env.BASE_URL || defaultBasePath;
    }

    /**
     * The name identifying the environment.
     */
    public name: CloudEnvironmentName;

    /**
     * The port to which the server should bind.
     * The default is 8080.
     */
    public port: number;

    /**
     * True if sensitive resources should be protected, otherwise false.
     * When enabled, sensitive resources will only be served if the request
     * contains the secret `x-debug-token` header.
     * Recommended in the `production` environment.
     */
    public protect: boolean;

    /**
     * The base URL for the app, which should be the host-relative path on which the app will be hosted.
     * The default is `/`.
     */
    public baseUrl: string;
}

/**
 * The environment in which the server runs.
 */
export const environment = new CloudEnvironment();
