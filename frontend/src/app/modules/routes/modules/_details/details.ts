import { autoinject } from "aurelia-framework";
import { AppRouter } from "aurelia-router";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { RouteService, Route, RouteStop, RouteStatus, RouteStatusSlug } from "app/model/route";
import { AgreementService } from "app/model/agreement";
import { DriverService } from "app/model/driver";
import { RouteStopPanel } from "./modals/route-stop/route-stop";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The ID of the route.
     */
    id?: string;
}

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param agreementService The `AgreementService` instance.
     * @param driverService The `DriverService` instance.
     * @param modalService The `ModalService` instance.
     * @param router The `AppRouter` instance.
     */
    public constructor(routeService: RouteService, agreementService: AgreementService, driverService: DriverService, modalService: ModalService, router: AppRouter)
    {
        this._routeService = routeService;
        this._agreementService = agreementService;
        this._driverService = driverService;
        this._modalService = modalService;
        this._router = router;
    }

    protected readonly _routeService: RouteService;
    protected readonly _agreementService: AgreementService;
    protected readonly _driverService: DriverService;
    protected readonly _modalService: ModalService;
    protected readonly _router: AppRouter;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The route to present.
     */
    protected route: Route | undefined;

    /**
     * The available route status values.
     */
    protected statusValues = Object.keys(RouteStatus.values).map(slug => ({ slug, ...RouteStatus.values[slug] }));

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        // Create and execute the new operation.
        this.fetchOperation = new Operation(async signal =>
        {
            // Fetch the data.
            this.route = await this._routeService.get(params.id!, signal);
        });
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }
    }

    /**
     * Called when the "Edit" icon is clicked on a route stop.
     * Opens at modal for editing the stop.
     * @param stop The stop to edit.
     */
    protected async onEditStopClick(stop: RouteStop): Promise<void>
    {
        const newStop = await this._modalService.open(RouteStopPanel, stop).promise;

        if (newStop != null)
        {
            this.route!.stops.splice(this.route!.stops.indexOf(stop), 1, newStop);
        }
    }

    /**
     * Called when the user changes the status of the route.
     * Sets the new status.
     * @param status The new status value.
     */
    protected async onChooseStatus(status: RouteStatusSlug): Promise<void>
    {
        if (status === this.route!.status.slug)
        {
            return;
        }

        try
        {
            await this._routeService.setRouteStatus(this.route!, status);
        }
        catch (error)
        {
            Log.error("Could not change route status", error);
        }
    }
}
