import { autoinject } from "aurelia-framework";
import { RouteService } from "app/model/route";
import { CommunicationService } from "app/model/_communication";

/**
 * Represents the module.
 */
@autoinject
export class LiveTrackingModule
{
    public constructor(
        routeService: RouteService,
        communicationService: CommunicationService)
    {
        this.routeService = routeService;
        this.communicationService = communicationService;
    }

    protected readonly routeService: RouteService;
    protected readonly communicationService: CommunicationService;
}
