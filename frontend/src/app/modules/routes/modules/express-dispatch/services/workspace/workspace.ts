import { observable } from "aurelia-framework";
import { ExpressRoute, DriverRoute, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";
import { DateTime } from "luxon";

export class Workspace
{
    public isMerging = false;
    public isBusy = false;
    public tab = "routes";

    public expressRoutes: ExpressRoute[] = [];
    public selectedExpressRoutes: ExpressRoute[] = [];

    public driverRoutes: DriverRoute[] = [];
    public selectedDriverRoutes: DriverRoute[] = [];

    public newDriverStops?: (DriverRouteStop | ExpressRouteStop)[];
    public remainingExpressStops?: ExpressRouteStop[][];

    /**
     * The selected date shown, defaults to today.
     */
    @observable({ changeHandler: "update" })
    public dateFilter: DateTime = DateTime.local();

    /**
     * Will clear all data currently selected or fetched
     */
    public clearAllData(): void
    {
        this.expressRoutes = [];
        this.selectedExpressRoutes = [];
        this.driverRoutes = [];
        this.selectedDriverRoutes = [];
        this.newDriverStops = undefined;
        this.remainingExpressStops = undefined;
    }
}
