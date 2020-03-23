import clone from "clone";

/**
 * Represents the definition of a round, which describes how much the driver can carry.
 */
export class TaskTimesRoundDefinition
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.colliPerRound = data.colliPerRound;
            this.weightPerRound = data.weightPerRound;
            this.volumePerRound = data.volumePerRound;
        }
    }

    /**
     * The max colli that can be transported in a round.
     */
    public colliPerRound: number;

    /**
     * The max weight that can be transported in a round.
     */
    public weightPerRound: number;

    /**
     * The max volume that can be transported in a round.
     */
    public volumePerRound: number;

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}
