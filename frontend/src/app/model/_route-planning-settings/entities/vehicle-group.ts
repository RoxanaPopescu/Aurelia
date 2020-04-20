import { VehicleType } from "app/model/vehicle";
import { VehicleGroupCost } from "./vehicle-group-cost";
import { VehicleGroupLimits } from "./vehicle-group-limits";
import { VehicleGroupLocation } from "./vehicle-group-location";
import clone from "clone";

/**
 * Represents settings associated with a vehicle group.
 */
export class VehicleGroup
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.name = data.name;
            this.id = data.id;
            this.cost = new VehicleGroupCost(data.cost);
            this.vehicleType = VehicleType.get(data.vehicleTypeId);
            this.limits = new VehicleGroupLimits(data.limits);
            this.orderTagsOneRequired = data.orderTagsOneRequired;
            this.startLocation = new VehicleGroupLocation(data.startLocation);
            this.endLocation = new VehicleGroupLocation(data.endLocation);
            this.routeTags = data.routeTags;
        }
        else
        {
            this.cost = new VehicleGroupCost();
            this.limits = new VehicleGroupLimits();
            this.orderTagsOneRequired = [];
            this.startLocation = new VehicleGroupLocation();
            this.endLocation = new VehicleGroupLocation();
            this.routeTags = [];
        }
    }

    /**
     * The name of the vehicle group.
     */
    public name: string;

    /**
     * The ID of the vehicle group.
     */
    public id: string;

    /**
     * The cost associated with the vehicle group.
     */
    public cost: VehicleGroupCost;

    /**
     * The vehicle type associated with the vehicle group.
     */
    public vehicleType: VehicleType;

    /**
     * The limits associated with the vehicle group.
     */
    public limits: VehicleGroupLimits;

    /**
     * The order tags matched by this criteria, where at least one of the specified tags match.
     */
    public orderTagsOneRequired: string[];

    /**
     * The start location associated with the vehicle group.
     */
    public startLocation: VehicleGroupLocation | undefined;

    /**
     * The end location associated with the vehicle group.
     */
    public endLocation: VehicleGroupLocation | undefined;

    /**
     * The route tags to associate with routes using this vehicle group.
     */
    public routeTags: string[];

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;

        if (data.startLocation?.location?.address == null)
        {
            delete data.startLocation;
        }

        if (data.endLocation?.location?.address == null)
        {
            delete data.endLocation;
        }

        delete data.vehicleType;
        data.vehicleTypeId = this.vehicleType.id;

        return data;
    }
}
