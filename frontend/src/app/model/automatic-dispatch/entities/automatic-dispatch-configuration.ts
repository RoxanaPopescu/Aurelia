import { Duration } from "luxon";

export class AutomaticDispatchConfiguration
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.available = data.available;
        this.pickupLeadTime = Duration.fromObject({ seconds: data.pickupLeadTime });;
    }

    /**
     * The organization ids to filter.
     */
    public available: boolean;

    /**
     * The pickup lead duration.
     */
    public pickupLeadTime: Duration;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;
        data.pickupLeadTime = this.pickupLeadTime?.as("seconds");

        return data;
    }
}
