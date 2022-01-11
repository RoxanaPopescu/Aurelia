import { OrganizationInfo } from "app/model/organization";
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
    public constructor(data: any)
    {
        this.organizations = data.organization.map(o => new OrganizationInfo(o));
        this.vehicleTypes = data.vehicleTypeIds.map(id => VehicleType.get(id));
    }

    /**
     * The organizations to match.
     */
    public organizations: OrganizationInfo[];

    /**
     * The vehicle types to match.
     */
    public vehicleTypes: VehicleType[];

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data =
        {
            organizationIds: this.organizations.map(o => o.id),
            vehicleTypes: this.vehicleTypes.map(vt => vt.id),
        };

        return data;
    }
}
