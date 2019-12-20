import { RouteStopBase } from "app/model/route";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class DriverRouteStop extends RouteStopBase
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
     * The IDs of the orders associated with this stop.
     */
    public orderIds: string[];

    /**
     * The number this stop will have on the new route.
     */
    public newStopNumber: number | undefined;

    /**
     * True if there is an alert for this route stop, otherwise false.
     * @returns True if there is an alert for this route stop, otherwise false.
     */
    public get hasAlert(): boolean
    {
        return this.isDelayed === true;
    }

    /**
     * True if there is an alert for this route stop, otherwise false.
     * @returns True if there is an alert for this route stop, otherwise false.
     */
    public get hasWarning(): boolean
    {
        return false;
    }
}
