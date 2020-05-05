import { DateTime } from "luxon";
import { Address } from "app/model/shared";
import { Fulfiller } from "app/model/outfit";
import { RouteStatus } from "./route-status";
import { VehicleType } from "app/model/vehicle";
import { RouteCriticality } from "..";

export class RouteInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.publicId;
        this.slug = data.slug;
        this.reference = data.routeReference;
        // FIXME:
        this.status = new RouteStatus("in-progress");
        this.startDateTime = DateTime.fromISO(data.startDateTime, { setZone: true });
        this.startAddress = new Address({ primary: data.pickupAddress });
        this.stopCount = data.stopCount;
        this.vehicleType = VehicleType.get(data.vehicleTypeId);
        // FIXME:
        this.criticality = new RouteCriticality("high");

        if (data.fulfiller)
        {
            this.fulfiller = new Fulfiller(data.fulfiller);
        }
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
     * The type of vehicle required for the route.
     */
    public readonly vehicleType: VehicleType;

    /**
     * The non-unique reference for the route,
     * or undefined if no reference has been assigned.
     */
    public readonly reference?: string;

    /**
     * The status of the route.
     */
    public readonly status: RouteStatus;

    /**
     * The criticality of the route.
     */
    public readonly criticality: RouteCriticality;

    /**
     * The fulfiller responsible for the shipment.
     */
    public readonly fulfiller?: Fulfiller;

    /**
     * The date and time at which the route is planned to start.
     */
    public readonly startDateTime: DateTime;

    /**
     * The address at which the route is planned to start.
     */
    public readonly startAddress: Address;

    /**
     * The number of stops on the route.
     */
    public readonly stopCount: number;
}
