import { Duration } from "luxon";
import { EntityInfo } from "app/types/entity";
import { Location } from "app/model/shared";
import { DistributionCenterAvailability } from "./distribution-center-availability";

/**
 * Represents a depot.
 */
export class DistributionCenter
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
            this.availability = data.availabilities.map(a => new DistributionCenterAvailability(a));
            this.location = new Location(data.location);
        }
        else
        {
            this.availability = [];
        }
    }

    /**
     * The ID of the distribution center.
     */
    public id: string;

    /**
     * The ID of the fulfiller that owns the depot.
     */
    public ownerId: string;

    /**
     * The name of the distribution center.
     */
    public name: string;

    /**
     * The duration of each time slot.
     */
    public slotInterval?: Duration;

    /**
     * The location of the distribution center.
     */
    public location?: Location;

    /**
     * The availability of the distribution center.
     */
    public availability: DistributionCenterAvailability[];

    /**
     * Gets an `EntityInfo` instance representing this instance.
     */
    public toEntityInfo(): EntityInfo
    {
        return new EntityInfo(
        {
            type: "distribution-center",
            id: this.id,
            name: this.name,
            description: `${this.location?.address?.primary ?? ""} ${this.location?.address?.secondary ?? ""}`.trim() ?? undefined
        });
    }
}
