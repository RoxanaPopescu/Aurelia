import { autoinject } from "aurelia-framework";
import { AppRouter } from "aurelia-router";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { RouteService, Route, RouteStop, RouteStatus, RouteStatusSlug } from "app/model/route";
import { AgreementService } from "app/model/agreement";
import { DriverService } from "app/model/driver";
import { RouteStopPanel } from "./modals/route-stop/route-stop";
import { ConfirmDeleteStopDialog } from "./modals/confirm-delete-stop/confirm-delete-stop";
import { AssignDriverPanel } from "./modals/assign-driver/assign-driver";
import { AssignFulfillerPanel } from "./modals/assign-fulfiller/assign-fulfiller";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The ID of the route.
     */
    id: string;
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
        this.fetchRoute(params.id);
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

        // if (newStop != null)
        // {
        //     this.route!.stops.splice(this.route!.stops.indexOf(stop), 1, newStop);
        // }

        if (newStop != null && newStop !== stop)
        {
            // Create and execute the new operation.
            this.fetchOperation = new Operation(async signal =>
            {
                // Fetch the data.
                this.route = await this._routeService.get(this.route!.id, signal);
            });
        }
    }

    /**
     * Called when the "Edit" icon is clicked on a route stop.
     * Opens at modal for editing the stop.
     * @param stop The stop to edit.
     */
    protected async onStopClick(stop: RouteStop): Promise<void>
    {
        const newStop = await this._modalService.open(RouteStopPanel, stop).promise;

        // if (newStop != null)
        // {
        //     this.route!.stops.splice(this.route!.stops.indexOf(stop), 1, newStop);
        // }

        if (newStop != null && newStop !== stop)
        {
            // Create and execute the new operation.
            this.fetchOperation = new Operation(async signal =>
            {
                // Fetch the data.
                this.route = await this._routeService.get(this.route!.id, signal);
            });
        }
    }

    /**
     * Called when the `Assign driver` button is clicked.
     * Opens the panel for assigning a driver to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignDriverClick(): Promise<void>
    {
        const driver = await this._modalService.open(AssignDriverPanel, this.route).promise;

        if (driver != null)
        {
            this.fetchRoute(this.route!.id);
        }
    }

    /**
     * Called when the `Assign fulfiller` button is clicked.
     * Opens the panel for assigning a fulfiller to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignFulfillerClick(): Promise<void>
    {
        const fulfiller = await this._modalService.open(AssignFulfillerPanel, this.route).promise;

        if (fulfiller != null)
        {
            this.fetchRoute(this.route!.id);
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

    /**
     * Called when the `Remove stop` icon is clicked on a route stop.
     * Asks the user to confirm, then deletes the stop from the route.
     * @param status The new status value.
     */
    protected async onRemoveStopClick(stop: RouteStop): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeleteStopDialog, stop).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._routeService.deleteRouteStatus(stop.id);

            this.route!.stops.splice(this.route!.stops.findIndex(s => s.id === stop.id), 1);
        }
        catch (error)
        {
            Log.error("Could not remove route stop", error);
        }
    }

    /**
     * Fetches the route.
     * @param routeId The ID of the route to fetch.
     */
    private fetchRoute(routeId: string): void
    {
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        this.fetchOperation = new Operation(async signal =>
        {
            this.route = await this._routeService.get(routeId, signal);
        });
    }
}
