import { Duration } from "luxon";
import { EntityInfo } from "app/types/entity";
import { Location } from "app/model/shared";
import { SearchModel } from "app/model/search-model";
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
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.ownerId = data.ownerId;
            this.name = data.name;
            this.slotInterval = Duration.fromObject({ seconds: data.slotInterval });
            this.availabilities = data.availabilities?.map(a => new DistributionCenterAvailability(a)) ?? [];
            this.location = new Location(data.location);
        }
        else
        {
            // HACK: Availabilities are deprecated and will be removed, but for now, they are still required.
            this.availabilities =
            [
                new DistributionCenterAvailability(
                {
                    created: false,
                    openingTime: 1,
                    closingTime: 2,
                    daysOfWeek: [1],
                    numberOfGates: 1
                })
            ];
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
    public location: Location;

    /**
     * @deprecated
     * The availabilities of the distribution center.
     */
    public availabilities: DistributionCenterAvailability[];

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);

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
            description: this.location?.address?.toString() ?? undefined
        });
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;

        data.slotInterval = this.slotInterval?.as("seconds");

        return data;
    }
}
