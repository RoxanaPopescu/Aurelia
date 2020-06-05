import { Location } from "app/model/shared";
import { RouteBase } from "./route-base";

export class RouteInfo extends RouteBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        super(data, []);
        this.startLocation = new Location(data.startLocation);
        this.endLocation = new Location(data.endLocation);
        this.stopCount = data.stopCount;
    }

    /**
     * The locati at which the route is planned to start.
     */
    public readonly startLocation: Location;

    /**
     * The location at which the route is planned to end.
     */
    public readonly endLocation: Location;

    /**
     * The number of stops on the route.
     */
    public readonly stopCount: number;
}
