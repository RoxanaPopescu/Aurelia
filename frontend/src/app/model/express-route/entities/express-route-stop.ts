import { RouteStopBase } from "app/model/route";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class ExpressRouteStop extends RouteStopBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any, stopNumber: number)
    {
        super(data, stopNumber);
    }

    /**
     * The number this stop will have on the new route.
     */
    public newStopNumber: number | undefined;
}
