import { Location } from "app/model/shared";
import { IRouteReference } from "..";
import { RouteStopDeliveryMethod } from "./route-stop-delivery-method";
import { RouteStopStatus } from "./route-stop-status";
import { RouteStopType } from "./route-stop-type";

/**
 * Represents a single location, where a driver must either pick up or deliver colli,
 * but where the user is not allowed to see any details about the stop.
 */
export class RouteStopInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any, stopNumber?: number, route?: IRouteReference)
    {
        if (route != null)
        {
            this.route = route;
        }

        if (data != null)
        {
            this.hidden = data.hidden;
            this.id = data.id;
            this.type = new RouteStopType(data.type);
            this.status = new RouteStopStatus(data.status);
            this.location = new Location(data.location);
            this.reference = data.reference;

            if (data.deliveryMethod != null)
            {
                this.deliveryMethod = new RouteStopDeliveryMethod(data.deliveryMethod);
            }
        }

        if (stopNumber != null)
        {
            this.stopNumber = stopNumber;
        }
    }

    /**
     * The ID of the route stop.
     */
    public readonly id: string;

    /**
     * The route this stop belongs to.
     */
    public readonly route: IRouteReference;

    /**
     * The ID of the route stop.
     */
    public readonly reference: string;

    /**
     * The number this stop has on the route.
     */
    public stopNumber: number;

    /**
     * The type of stop.
     */
    public type: RouteStopType;

    /**
     * The status of this route stop.
     */
    public readonly status: RouteStopStatus;

    /**
     * The delivery method of this route stop.
     */
     public readonly deliveryMethod?: RouteStopDeliveryMethod;

    /**
     * The address identifying the location of the stop,
     * where only the position is provided.
     */
    public readonly location: Location;

    /**
     * Some users are not allwoed to see all stops on a route since
     * a route can be combined from multiple customers
     */
    public hidden: boolean;
}
