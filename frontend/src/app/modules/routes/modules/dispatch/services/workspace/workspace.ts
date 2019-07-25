import { ExpressRoute, DriverRoute } from "app/model/express-route";

export class Workspace
{
    public expressRoutes: ExpressRoute[] = [];
    public selectedExpressRoutes: ExpressRoute[] = [];

    public driverRoutes: DriverRoute[] = [];
    public selectedDriverRoutes: DriverRoute[] = [];

    public newDriverRoute: DriverRoute;
}
