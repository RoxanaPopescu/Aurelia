import { ExpressRoute, DriverRoute, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";

export class Workspace
{
    public isMerging = false;
    public tab = "routes";

    public expressRoutes: ExpressRoute[] = [];
    public selectedExpressRoutes: ExpressRoute[] = [];

    public driverRoutes: DriverRoute[] = [];
    public selectedDriverRoutes: DriverRoute[] = [];

    public newDriverStops?: (DriverRouteStop | ExpressRouteStop)[];
    public remainingExpressStops?: ExpressRouteStop[][];
}
