import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { ModalService, IScroll } from "shared/framework";
import { RouteService, Route, RouteStop, RouteStatus, RouteStatusSlug } from "app/model/route";
import { RouteStopPanel } from "./modals/route-stop/route-stop";
import { CancelDeleteStopDialog } from "./modals/confirm-cancel-stop/confirm-cancel-stop";
import { AssignDriverPanel } from "./modals/assign-driver/assign-driver";
import { AssignFulfillerPanel } from "./modals/assign-fulfiller/assign-fulfiller";
import { IdentityService } from "app/services/identity";
import { AddSupportNoteDialog } from "./modals/add-support-note/add-support-note";

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
     * @param modalService The `ModalService` instance.
     * @param modalService The `IdentityService` instance.
     * @param router The `Router` instance.
     */
    public constructor(routeService: RouteService, modalService: ModalService, identityService: IdentityService, router: Router)
    {
        this._routeService = routeService;
        this._modalService = modalService;
        this._router = router;
        this.identityService = identityService;
        this.editable = identityService.identity?.hasClaim("edit-routes") ?? false;
    }

    private _isMovingStop = false;
    private _targetIndex: number | undefined;
    private pollTimeout: any;

    private readonly _routeService: RouteService;
    private readonly _modalService: ModalService;
    private readonly _router: Router;
    protected readonly identityService: IdentityService;
    protected readonly environment = ENVIRONMENT.name;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The data table element.
     */
    protected dataTableElement: HTMLElement;

    /**
     * If the current user is allowed to edit the route.
     */
    protected editable = false;

    /**
     * True to show the map, otherwise false.
     */
    protected routeId: string;

    /**
     * True to show the map, otherwise false.
     */
    protected showMap = false;

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
        this.routeId = params.id;
        this.fetchRoute();
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
            this.fetchRoute();
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
            this.fetchRoute();
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
     * Called when the `Add support note` button is clicked.
     * Shows a model for adding a support note.
     */
    protected async onAddSupportNoteClick(): Promise<void>
    {
        const added = await this._modalService.open(AddSupportNoteDialog, { route: this.route! }).promise;

        if (!added)
        {
            return;
        }

        this.fetchRoute();
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
    protected async onStopClick(stop: RouteStop, edit: boolean): Promise<void>
    {
        const savedStop = await this._modalService.open(RouteStopPanel, { route: this.route!, routeStop: stop, edit }).promise;

        if (savedStop != null)
        {
            this.route!.stops.splice(this.route!.stops.indexOf(stop), 1, savedStop);

            this.fetchRoute();
        }
    }

    /**
     * Called when the `Remove stop` icon is clicked on a route stop.
     * Asks the user to confirm, then deletes the stop from the route.
     * @param stop The stop to remove.
     */
    protected async onRemoveStopClick(stop: RouteStop): Promise<void>
    {
        const confirmed = await this._modalService.open(CancelDeleteStopDialog, stop).promise;

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

        this.fetchRoute();
    }

    /**
     * Called when a stop is moved to a new position in the list.
     * @param source The stop being moved.
     * @param target The stop currently occupying the target position.
     */
    protected onMoveStop(source: RouteStop, target: RouteStop): void
    {

        console.log(source);
        const sourceIndex = this.route!.stops.indexOf(source);
        this._targetIndex = this.route!.stops.indexOf(target);

        this.route!.stops.splice(this._targetIndex, 0, ...this.route!.stops.splice(sourceIndex, 1));

        if (!this._isMovingStop)
        {
            this._isMovingStop = true;

            document.addEventListener("mouseup", async () =>
            {
                if (this._targetIndex !== source.stopNumber - 1)
                {
                    try
                    {
                        await this._routeService.moveRouteStop(this.route!, source, this._targetIndex!)

                        this.fetchRoute();
                    }
                    catch (error)
                    {
                        Log.error("Could not move route stop", error);
                    }
                    finally
                    {
                        this._isMovingStop = false;
                        this._targetIndex = undefined;
                    }
                }
            }, { once: true });
        }
    }

    /**
     * Called when the `Add new stop` button is clicked, either at the bottom of the list, or between rows.
     * @param index The index at which the stop should be inserted, or undefined to append it to the list.
     */
    protected async onAddStopClick(index?: number): Promise<void>
    {
        let stopNumber: number;
        if (index != null) {
            // Index exist, 1-index it since it's stopNumber
            stopNumber = index + 1;
        } else {
            // End of list, since it's a stopNumber we add one to the list length
            stopNumber = this.route!.stops.length + 1;
        }

        const newStop = new RouteStop(undefined, stopNumber);
        const savedStop = await this._modalService.open(RouteStopPanel, { route: this.route!, routeStop: newStop, edit: true }).promise;

        if (savedStop != null)
        {
            if (index != null)
            {
                this.route!.stops.splice(index, 0, savedStop);
            }
            else
            {
                this.route!.stops.push(savedStop);
            }

            this.fetchRoute();
        }
    }

    /**
     * Called whrn a stop is clicked on the map.
     * Scrolls to the stop that was clicked.
     * @param stop The stop that was clicked.
     */
    protected onMapStopClick(stop: RouteStop): void
    {
        const element = this.dataTableElement.querySelectorAll(".route-details-stop-number")[stop.stopNumber - 2];
        element.scrollIntoView();
    }

    /**
     * Fetches the specified route.
     * @param routeId The ID of the route to fetch.
     */
    private fetchRoute(): void
    {
        clearTimeout(this.pollTimeout);

        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        this.fetchOperation = new Operation(async signal =>
        {
            this.route = await this._routeService.get(this.routeId, signal);

            this._router.title = this.route.slug;
            this._router.updateTitle();

            this.pollTimeout = setTimeout(() => this.fetchRoute(), 6000);
        });
    }
}