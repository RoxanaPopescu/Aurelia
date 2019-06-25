/**
 * Represents the identifiers for the supported server environments.
 * The server environment is that in which the server runs.
 */
export type ServerEnvironmentName = "development" | "preview" | "production";

/**
 * Represents the environment in which the server runs.
 */
export class ServerEnvironment
{
    public constructor()
    {
        // The default environment to use if `NODE_ENV` is undefined.
        const defaultName = "development";

        // The default port to use if `PORT` is undefined.
        const defaultPort = "8008";

        // Configure environment.
        this.name = (process.env.NODE_ENV || defaultName).trim() as ServerEnvironmentName;
        this.port = parseInt(process.env.PORT || defaultPort);
        this.protect = this.name !== "development";
        this.stubs = this.name === "development";
        this.debug = this.name === "development";
        this.apiBaseUrl = this.name === "development"
            ? "https://bff-v1-test-mover.azurewebsites.net/"
            : "https://consignor-bff.mover.dk/";
    }

    /**
     * The name identifying the environment.
     */
    public name: ServerEnvironmentName;

    /**
     * The port to which the server should bind.
     * The default is `8008`.
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
     * True to enable API response stubs, otherwise false.
     */
    public stubs: boolean;

    /**
     * True to enable debugging features, otherwise false.
     * Recommended in the `development` environment.
     */
    public debug: boolean;

    /**
     * The base URL for the API.
     * Note that this is independent of the `appBaseUrl` and must end with a `/`.
     */
    public apiBaseUrl: string;
}

/**
 * The environment in which the server runs.
 */
export const environment = new ServerEnvironment();
