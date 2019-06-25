import { Duration } from "luxon";
import { Location } from "app/model/shared";
import { DepotAvailability } from "./depot-availability";

/**
 * Represents a depot.
 */
export class Depot
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.ownerId = data.ownerId;
            this.name = data.name;
            this.slotInterval = Duration.fromObject({ seconds: data.slotInterval });
            this.availability = data.availabilities.map(a => new DepotAvailability(a));
            this.location = new Location(data.location);
        }
        else
        {
            this.availability = [];
        }
    }

    /**
     * The ID of the depot.
     */
    public id: string;

    /**
     * The ID of the fulfiller that owns the depot.
     */
    public ownerId: string;

    /**
     * The name of the depot.
     */
    public name: string;

    /**
     * The duration of each time slot.
     */
    public slotInterval?: Duration;

    /**
     * The location of the depot.
     */
    public location?: Location;

    /**
     * The availability of the depot.
     */
    public availability: DepotAvailability[];
}
