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
    /**
     * Creates a new instance of the type.
     */
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
        this.baseUrl = process.env.BASE_URL || defaultBasePath;
        this.protect = this.name !== "development";
        this.prerender = false;
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
     * The base URL for the app, which should be the host-relative path
     * on which the app will be hosted, and must end with a `/`.
     * The default is `/`.
     */
    public baseUrl: string;

    /**
     * True if sensitive resources should be protected, otherwise false.
     * When enabled, sensitive resources will only be served if the request
     * contains the secret `x-debug-token` header.
     * Recommended in the `production` environment.
     */
    public protect: boolean;

    /**
     * True to enable prerendering, otherwise false.
     * The default is false.
     */
    public prerender: boolean;
}

/**
 * The environment in which the server runs.
 */
export const environment = new CloudEnvironment();
