/**
 * Represents the tasks for a route
 */
export class Task
{
    /**
     * The slug identifying the task.
     */
    slug: string;

    /**
     * If the task is enabled.
     * The task can be in three states, not existing, enabled and disabled.
     */
    enabled: boolean;

    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.slug = data.slug;
        this.enabled = data.enabled;
    }
}
