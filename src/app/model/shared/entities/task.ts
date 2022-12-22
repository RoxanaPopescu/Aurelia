import { TaskType } from "./task-type";

/**
 * Represents the tasks for a route/order
 */
export class Task
{
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
     * The type identifying the task.
     */
    public type: TaskType;

    /**
     * True if the task is enabled, false if the task is disabled,
     * or undefined if not existing.
     */
    public enabled: boolean | undefined;

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
