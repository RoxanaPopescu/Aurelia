import { Duration } from "luxon";
import { DayOfWeek } from "app/model/shared";

/**
 * @deprecated
 * Represents an availability associated with a distribution center.
 */
export class DistributionCenterAvailability
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data)
        {
            this.created = true;
            this.openingTime = Duration.fromObject({ seconds: data.openingTime });
            this.closingTime = Duration.fromObject({ seconds: data.closingTime });
            this.numberOfGates = data.numberOfGates;
            this.daysOfWeek = data.daysOfWeek;
        }
        else
        {
            this.created = false;
        }
    }

    /**
     * HACK: Without this, updating apparently fails.
     * Has it been created on the server?
     */
    private created: boolean;

    /**
     * The time of day at which the depot opens.
     */
    public openingTime?: Duration;

    /**
     * The time of day at which the depot closes.
     */
    public closingTime?: Duration;

    /**
     * The number of gates available.
     */
    public numberOfGates?: number;

    /**
     * The days of the week on which this availability applies.
     */
    public daysOfWeek?: DayOfWeek[];

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;

        data.created = this.created;
        data.openingTime = this.openingTime?.as("seconds");
        data.closingTime = this.closingTime?.as("seconds");

        return data;
    }
}
