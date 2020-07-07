import { autoinject } from "aurelia-framework";
import { RouteService } from "app/model/route";

/**
 * Represents the module.
 */
@autoinject
export class LiveTrackingModule
{
    public constructor(routeService: RouteService)
    {
        this.routeService = routeService;
    }

    protected readonly routeService: RouteService;
}
