/**
 * Represents additional task time.
 */
export class TaskTimesAdditionalTime
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.initial = data.initial;
            this.perFloor = data.perFloor;
            this.perRound = data.perRound;
        }
    }

    /**
     * The initial time to add.
     */
    public initial: number;

    /**
     * The time to add for each floor.
     */
    public perFloor: number;

    /**
     * The time to add for each round at the ground floor.
     */
    public perRound: number;
}
