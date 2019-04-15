import { DateTime } from "luxon";
import { Address } from "app/model/entities/shared";
import { RouteStatus } from "../route-status";
import { Fulfiller } from "../../outfit/fulfiller";

export class RouteInfo
{
    public constructor(data: any)
    {
        this.id = data.publicId;
        this.slug = data.slug;
        this.reference = data.routeReference;
        this.status = new RouteStatus(data.status);
        this.startDateTime = DateTime.fromISO(data.startDateTime, { setZone: true });
        this.startAddress = new Address({ primary: data.pickupAddress });
        this.stopCount = data.stopCount;

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
     * The non-unique reference for the route,
     * or undefined if no reference has been assigned.
     */
    public readonly reference?: string;

    /**
     * The status of the route.
     */
    public readonly status: RouteStatus;

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
