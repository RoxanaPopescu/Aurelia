/**
 * Represents the identifiers for the supported task environments.
 * The task environment is that in which the tasks run.
 */
export type TaskEnvironmentName = "development" | "build";

/**
 * Represents the environment in which the tasks run.
 */
export class TaskEnvironment
{
    public constructor()
    {
        // The default environment to use if `NODE_ENV` is undefined.
        const defaultName = "development";

        this.name = (process.env.NODE_ENV || defaultName).trim() as TaskEnvironmentName;
    }

    /**
     * The name identifying the environment.
     */
    public name: TaskEnvironmentName;
}

/**
 * The environment in which the task runs.
 */
export const environment = new TaskEnvironment();
