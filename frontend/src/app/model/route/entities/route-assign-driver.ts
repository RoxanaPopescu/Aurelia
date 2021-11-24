import { RouteInfo } from "..";
import { Driver } from "app/model/driver";

export class RouteAssignDriver
{
    /**
     * Creates a new instance of the type.
     * @param route The route to assign to.
     * @param driver The driver to assign to the route
     */
    public constructor(route: RouteInfo, driver?: Driver)
    {
        this.route = route;
        this.driver = driver;
    }

    /**
     * The route to assign the driver.
     */
    public readonly route: RouteInfo;

    /**
     * The driver to be assigned.
     */
    public readonly driver?: Driver;

    /**
     * If the driver is being assigned.
     */
    public assigning: boolean = false;
}
