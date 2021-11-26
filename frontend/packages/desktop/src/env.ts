/**
 * Represents the identifiers for the supported desktop environments.
 * The desktop environment is that in which the app runs.
 */
export type DesktopEnvironmentName = "development" | "preview" | "production";

/**
 * Represents the environment in which the app runs.
 */
export class DesktopEnvironment
{
    /**
     * Creates a new instance of the type.
     */
    public constructor()
    {
        // The default environment to use if `NODE_ENV` is undefined.
        const defaultName = "development";

        this.name = (process.env.NODE_ENV || defaultName).trim() as DesktopEnvironmentName;
        this.debug = this.name === "development";
        this.devTools = this.name === "development";
    }

    /**
     * The name identifying the environment.
     */
    public name: DesktopEnvironmentName;

    /**
     * True to enable debugging features, otherwise false.
     * Recommended in the `development` environment.
     */
    public debug: boolean;

    /**
     * True to open the development tools when the app starts, otherwise false.
     * Recommended in the `development` environment.
     */
    public devTools: boolean;
}

/**
 * The environment in which the server runs.
 */
export const environment = new DesktopEnvironment();
