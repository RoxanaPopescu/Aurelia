import { RouteStop as AbstractRouteStop } from "../route-stop";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class RouteStop extends AbstractRouteStop
{
    public constructor(data: any, stopNumber: number)
    {
        super(data, stopNumber);

        this.orderIds = data.orderIds;
    }

    /**
     * The order ID's for the pickups and deliveries to be completed at this stop.
     */
    public readonly orderIds: string[];
}
