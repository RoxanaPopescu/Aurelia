import { TaskTimesAdditionalTime } from "./task-times-additional-time";
import { TaskTimesRoundDefinition } from "./task-times-round-definition";
import { TaskTimesScenario } from "./task-times-scenario";

/**
 * Represents settings related to task times.
 */
export class TaskTimes
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.base = new TaskTimesAdditionalTime(data.base);
            this.roundDefinition = new TaskTimesRoundDefinition(data.roundDefinition);
            this.scenarios = data.scenarios.map(d => new TaskTimesScenario(d));
        }
        else
        {
            this.base = new TaskTimesAdditionalTime();
            this.roundDefinition = new TaskTimesRoundDefinition();
            this.scenarios = [];
        }
    }

    /**
     * The additional time to add, if no scenario matches.
     */
    public base: TaskTimesAdditionalTime;

    /**
     * The round definition, which describes how much the driver can carry.
     */
    public roundDefinition: TaskTimesRoundDefinition;

    /**
     * The scenarios in which settings should be applied.
     */
    public scenarios: TaskTimesScenario[];
}
