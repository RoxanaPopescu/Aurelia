import { DateTime } from "luxon";
import { Address } from "app/model/shared";
import { Fulfiller } from "app/model/outfit";
import { VehicleType } from "app/model/vehicle";
import { RouteCriticality } from "..";
import { RouteStatusList } from "./route-status-list";

export class RouteInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.slug = data.slug;
        this.reference = data.reference;
        this.status = new RouteStatusList(data.status);
        this.startDate = DateTime.fromISO(data.startDate, { setZone: true });
        this.startAddress = new Address({ primary: data.startAddress });
        this.stopCount = data.stopCount;
        this.vehicleType = VehicleType.get(data.vehicleTypeId);
        this.tags = data.tags;
        this.fulfiller = new Fulfiller(data.fulfiller);

        // FIXME:
        this.criticality = new RouteCriticality("low");
    }

    /**
     * The ID of the route.
     */
    public readonly id: string;

    /**
     * The slug identifying the route.
     */
    public readonly slug: string;

    /**
     * The tags for the route.
     */
    public readonly tags: string[];

    /**
     * The type of vehicle required for the route.
     */
    public readonly vehicleType: VehicleType;

    /**
     * The non-unique reference for the route,
     * or undefined if no reference has been assigned.
     */
    public readonly reference?: string;

    /**
     * The status of the route list.
     */
    public readonly status: RouteStatusList;

    /**
     * The criticality of the route.
     */
    public readonly criticality: RouteCriticality;

    /**
     * The fulfiller responsible for the shipment.
     */
    public readonly fulfiller: Fulfiller;

    /**
     * The date and time at which the route is planned to start.
     */
    public readonly startDate: DateTime;

    /**
     * The address at which the route is planned to start.
     */
    public readonly startAddress: Address;

    /**
     * The number of stops on the route.
     */
    public readonly stopCount: number;
}
