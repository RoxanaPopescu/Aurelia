import { RouteStopBase } from "app/model/route";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class RouteStop extends RouteStopBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
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
