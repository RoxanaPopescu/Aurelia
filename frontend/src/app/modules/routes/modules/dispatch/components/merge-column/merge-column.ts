import { autoinject, bindable } from "aurelia-framework";
import { ExpressRouteService, DriverRouteStop } from "app/model/express-route";
import { Workspace } from "../../services/workspace";

@autoinject
export class MergeColumnCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `ExpressRouteService` instance.
     */
    public constructor(routeService: ExpressRouteService)
    {
        this._expressRouteService = routeService;
    }

    protected readonly _expressRouteService: ExpressRouteService;

    /**
     * The workspace.
     */
    @bindable
    protected workspace: Workspace;

    protected driverStops: DriverRouteStop[];
    protected expressStops: DriverRouteStop[];

    /**
     * Called by the framework when the component is attached to the DOM.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async attached(): Promise<void>
    {
        this.driverStops = this.workspace.selectedDriverRoutes[0].stops;
        this.expressStops = [];

        for (const route of this.workspace.selectedExpressRoutes)
        {
            this.expressStops.push(...route.stops);
        }
    }
}
