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
    public constructor()
    {
        // The default environment to use if `NODE_ENV` is undefined.
        const defaultName = "development";

        this.name = (process.env.NODE_ENV || defaultName).trim() as DesktopEnvironmentName;
    }

    /**
     * The name identifying the environment.
     */
    public name: DesktopEnvironmentName;

    /**
     * True to enable debugging features, otherwise false.
     * Recommended in the `development` environment.
     */
    public debug: boolean = true;

    /**
     * True to open the development tools, otherwise false.
     * Recommended in the `development` environment.
     */
    public devTools: boolean = true;
}

/**
 * The environment in which the server runs.
 */
export const environment = new DesktopEnvironment();
