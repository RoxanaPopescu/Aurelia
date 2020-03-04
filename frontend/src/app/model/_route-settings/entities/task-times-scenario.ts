import { TaskTimesCriteria } from "./task-times-criteria";
import { TaskTimesAdditionalTime } from "./task-times-additional-time";

/**
 * Represents a task time scenario.
 */
export class TaskTimesScenario
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.criteria = new TaskTimesCriteria(data.criteria);
            this.additionalTime = new TaskTimesAdditionalTime(data.additionalTime);
        }
        else
        {
            this.criteria = new TaskTimesCriteria();
            this.additionalTime = new TaskTimesAdditionalTime();
        }
    }

    /**
     * The matching criteria for the scenario.
     */
    public criteria: TaskTimesCriteria;

    /**
     * The additional task time to add.
     */
    public additionalTime: TaskTimesAdditionalTime;
}
