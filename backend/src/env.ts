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
        // The default environment to use if NODE_ENV is undefined.
        const defaultName = "development";

        this.name = (process.env.NODE_ENV || defaultName).trim() as ServerEnvironmentName;
        this.protect = this.name !== "development";
    }

    /**
     * The name identifying the environment.
     */
    public name: ServerEnvironmentName;

    /**
     * True if sensitive resources should be protected, otherwise false.
     * When enabled, sensitive resources will only be served if the request
     * contains the secret `x-debug-token` header.
     */
    public protect: boolean;
}

/**
 * The environment in which the server runs.
 */
export const environment = new ServerEnvironment();
