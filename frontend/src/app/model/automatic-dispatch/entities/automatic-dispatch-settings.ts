import { EntityInfo } from "app/types/entity";
import { DateTime } from "luxon";
import { AutomaticDispatchRouteFilter } from "./automatic-dispatch-route-filter";
import { AutomaticDispatchShipmentFilter } from "./automatic-dispatch-shipment-filter";

/**
 * Represents a rule set to use for automatic dispatch.
 */
export class AutomaticDispatchSettings
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
            this.name = data.name;
            this.paused = data.paused;
            this.created = DateTime.fromISO(data.createdAt, { setZone: true });
            this.updated = DateTime.fromISO(data.updatedAt, { setZone: true });
            this.shipmentFilter = new AutomaticDispatchShipmentFilter(data.shipmentFilter);
            this.routeFilter = new AutomaticDispatchRouteFilter(data.routeFilter);
        }
        else
        {
            this.paused = false;
            this.shipmentFilter = new AutomaticDispatchShipmentFilter();
            this.routeFilter = new AutomaticDispatchRouteFilter();
        }
    }

    /**
     * The ID identifying the filter.
     */
    public readonly id: string;

    /**
     * The name of the filter.
     */
    public readonly name: string;

    /**
     * True if the filter is paused, otherwise false.
     */
    public paused: boolean;

    /**
     * The date and time at which the filter was created.
     */
    public created: DateTime;

    /**
     * The date and time at which the filter was last updated.
     */
    public updated: DateTime;

    /**
     * The shipment filter criteria.
     */
    public readonly shipmentFilter: AutomaticDispatchShipmentFilter;

    /**
     * The route filter criteria.
     */
    public readonly routeFilter: AutomaticDispatchRouteFilter;

    /**
     * Gets an `EntityInfo` instance representing this instance.
     */
    public toEntityInfo(): EntityInfo
    {
        return new EntityInfo(
        {
            type: "automatic-dispatch-rule-set",
            id: this.id,
            name: this.name
        });
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data =
        {
            id: this.id,
            name: this.name,
            shipmentFilter: this.shipmentFilter,
            routeFilter: this.routeFilter
        };

        return data;
    }
}
