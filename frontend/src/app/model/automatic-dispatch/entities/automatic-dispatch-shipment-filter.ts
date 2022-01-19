import { Duration } from "luxon";
import { VehicleType } from "app/model/vehicle";

/**
 * Represents a shipment filter to use for automatic dispatch.
 */
export class AutomaticDispatchShipmentFilter
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.organizationIds = data.organizationIds;
            this.vehicleTypes = data.vehicleTypeIds?.map(id => VehicleType.get(id));
            this.pickupLeadTime = Duration.fromObject({ seconds: data.pickupLeadTime });
        }
    }

    /**
     * The organization IDs to match, if any.
     */
    public organizationIds: string[] | undefined;

    /**
     * The vehicle types to match, if any.
     */
    public vehicleTypes: VehicleType[] | undefined;

    /**
     * The max time before the pickup time, at which a shipment may match.
     */
    public pickupLeadTime: Duration;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data =
        {
            organizationIds: this.organizationIds,
            vehicleTypeIds: this.vehicleTypes?.map(vt => vt.id),
            pickupLeadTime: this.pickupLeadTime?.as("seconds")
        };

        return data;
    }
}
