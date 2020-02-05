import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
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
     * @param router The `Router` instance.
     */
    public constructor(routeService: RouteService, agreementService: AgreementService, driverService: DriverService, modalService: ModalService, router: Router)
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
    protected readonly _router: Router;

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
     * Called when the `Show driver list` button is clicked.
     * Opens the driver list in a new tab.
     */
    protected onShowDriverListClick(): void
    {
        window.open(this.route?.driverListUrl, "_blank");
    }
    /**
     * Called when the `Reload route in app` button is clicked.
     * Notifies the driver appthat it should reload the route.
     */
    protected async onReloadRouteInAppClick(): Promise<void>
    {
        try
        {
            await this._routeService.reloadRoute(this.route!);
        }
        catch (error)
        {
            Log.error("Could not reload the route", error);
        }
    }

    /**
     * Called when an item in the `Status` selector is clicked.
     * Sets the new route status.
     * @param status The slug identifying the new route status.
     */
    protected async onStatusItemClick(status: RouteStatusSlug): Promise<void>
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
     * Called when a route stop is clicked.
     * Opens a modal showing the details of the stop.
     * @param stop The stop to edit.
     */
    protected async onStopClick(stop: RouteStop): Promise<void>
    {
        const savedStop = await this._modalService.open(RouteStopPanel, { route: this.route!, routeStop: stop }).promise;

        if (savedStop != null)
        {
            // TODO: Do we need this, or should we only fetch the new route?
            if (savedStop.id)
            {
                this.route!.stops.splice(this.route!.stops.indexOf(stop), 1, savedStop);
            }
            else
            {
                // TODO: Insert stop at the correct index.
                // this.route!.stops.push(savedStop);
            }

            this.fetchRoute(this.route!.id);
        }
    }

    /**
     * Called when the "Edit" icon is clicked on a route stop.
     * Opens a modal for editing the stop.
     * @param stop The stop to edit.
     */
    protected async onEditStopClick(stop: RouteStop): Promise<void>
    {
        // TODO: Open directly in edit mode.
        await this.onStopClick(stop);
    }

    /**
     * Called when the `Remove stop` icon is clicked on a route stop.
     * Asks the user to confirm, then deletes the stop from the route.
     * @param stop The stop to remove.
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
            await this._routeService.setRouteStopStatus(this.route!, stop, "cancelled");
        }
        catch (error)
        {
            Log.error("Could not remove route stop", error);
        }

        this.fetchRoute(this.route!.id);
    }

    /**
     * Called when a stop is moved to a new position in the list.
     * @param source The stop being moved.
     * @param target The stop currently occupying the target position.
     */
    protected async onMoveStop(source: RouteStop, target: RouteStop): Promise<void>
    {
        try
        {
            const sourceIndex = this.route!.stops.indexOf(source);
            const targetIndex = this.route!.stops.indexOf(target);

            this.route!.stops.splice(targetIndex, 0, ...this.route!.stops.splice(sourceIndex, 1));

            // TODO: Don't do this until after the user releases the mouse button.
            //await this._routeService.moveRouteStop(this.route!, source, targetIndex);
        }
        catch (error)
        {
            Log.error("Could not move route stop", error);
        }

        this.fetchRoute(this.route!.id);
    }

    /**
     * Fetches the specified route.
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

            this._router.title = this.route.slug;
            this._router.updateTitle();
        });
    }
}
