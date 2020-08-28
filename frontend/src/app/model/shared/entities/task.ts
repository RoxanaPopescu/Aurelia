import { TaskType } from "./task-type";

/**
 * Represents the tasks for a route/order
 */
export class Task
{
    /**
     * The type identifying the task.
     */
    type: TaskType;

    /**
     * If the task is enabled.
     * The task can be in three states, not existing, enabled and disabled.
     */
    enabled: boolean | undefined;

    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.type = new TaskType(data.type);
        this.enabled = data.enabled;
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            type: this.type.slug,
            enabled: this.enabled
        };
    }
}
