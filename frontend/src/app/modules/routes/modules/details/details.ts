import { autoinject, computedFrom, observable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { ModalService, IScroll, ToastService } from "shared/framework";
import { RouteService, Route, RouteStop, RouteStatus, RouteStatusSlug, RouteStopInfo } from "app/model/route";
import { RouteStopPanel } from "./modals/route-stop/route-stop";
import { CancelDeleteStopDialog } from "./modals/confirm-cancel-stop/confirm-cancel-stop";
import { AssignDriverPanel } from "../../modals/assign-driver/assign-driver";
import { AssignOrganizationPanel } from "../../modals/assign-organization/assign-organization";
import { IdentityService, moverOrganizationId } from "app/services/identity";
import { AddSupportNoteDialog } from "./modals/add-support-note/add-support-note";
import { AssignVehiclePanel } from "../../modals/assign-vehicle/assign-vehicle";
import { AbortError } from "shared/types";
import { PushDriversPanel } from "../../modals/push-drivers/push-drivers";
import { EditInformationPanel } from "./modals/edit-information/edit-information";
import { RemoveDriverPanel } from "./modals/remove-driver/remove-driver";
import { AddOrdersPanel } from "./modals/add-orders/add-orders";
import addedOrdersToast from "./resources/strings/added-orders-toast.json";
import { AssignTeamPanel } from "../../modals/assign-team/assign-team";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";
import { LocalStateService } from "app/services/local-state";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The slug identifying of the route.
     */
    slug: string;
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
     * @param toastService The `ToastService` instance.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     * @param localStateService The `LocalStateService` instance.
     * @param router The `Router` instance.
     */
    public constructor(
        routeService: RouteService,
        modalService: ModalService,
        identityService: IdentityService,
        toastService: ToastService,
        localStateService: LocalStateService,
        router: Router)
    {
        this.routeService = routeService;
        this._modalService = modalService;
        this.toastService = toastService;
        this.identityService = identityService;
        this._localStateService = localStateService;
        this._router = router;
    }

    private readonly _modalService: ModalService;
    private readonly _localStateService: LocalStateService;
    private readonly _router: Router;
    private readonly _wrappedStops: { value: RouteStop | RouteStopInfo }[] = [];
    private _isMovingStop = false;
    private _targetIndex: number | undefined;
    private _pollTimeout: any;

    protected readonly routeService: RouteService;
    protected readonly toastService: ToastService;
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
     * The ID of the route to present.
     */
    protected routeSlug: string;

    /**
     * True to show the map, otherwise false.
     */
    @observable
    protected showMap: boolean;

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
    protected statusValues = Object.keys(RouteStatus.values).map(slug => new RouteStatus(slug as any));

    /**
     * * True if the user is authorized to assign routes, otherwise false,
     */
    @computedFrom("identityService.identity.claims.size")
    protected get canAssign(): boolean
    {
        return (
            this.identityService.identity!.claims.has("assign-organization-route") ||
            this.identityService.identity!.claims.has("assign-driver-route") ||
            this.identityService.identity!.claims.has("edit-routes"));
    }

    /**
     * True if the user is authorized to edit the route, otherwise false,
     */
    @computedFrom("identityService.identity.claims.size")
    protected get canEditRoute(): boolean
    {
        return this.identityService.identity!.claims.has("edit-routes");
    }

    /**
     * Gets the route stops, as a stable array of wrapper objects.
     *
     * Wraps the items of an immutable iterable.
     * This is intended to be used as a performance optimization for `repeat.for`, as it prevents elements
     * in the DOM from being unnessesarily destroyed and recreated whenever the iterable is replaced.
     * Note that this converter does not observe mutations of the iterable, meaning that this only works if
     * the iterable is treated as immutable, and is replaced with a new instance whenever the items change.
     * @returns The iterable containing the wrapped items, where each wrapped item
     * is an object that exposes the corresponding item as a `value` property.
     */
    @computedFrom("route.stops.length")
    protected get wrappedStops(): Iterable<{ value: RouteStop | RouteStopInfo }> | undefined
    {
        const value = this.route?.stops;

        if (value == null)
        {
            return value;
        }

        const array = value instanceof Array ? value : Array.from<RouteStop | RouteStopInfo>(value);

        for (let i = 0; i < Math.min(this._wrappedStops.length, array.length); i++)
        {
            this._wrappedStops[i].value = array[i];
        }

        for (let i = this._wrappedStops.length; i < array.length; i++)
        {
            this._wrappedStops.push({ value: array[i] });
        }

        for (let i = array.length; i < this._wrappedStops.length; i++)
        {
            this._wrappedStops.splice(i, 1);
        }

        return this._wrappedStops;
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this.showMap = this._localStateService.get().routeDetails?.showMap ?? true;
        this.routeSlug = params.slug;

        this.startPolling(true);
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        this.stopPolling();
    }

    /**
     * Called when the `Assign driver` button is clicked.
     * Opens the panel for assigning a driver to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignDriverClick(): Promise<void>
    {
        this.stopPolling();

        await this._modalService.open(AssignDriverPanel, { route: this.route!, assignOnSelect: true }).promise;

        this.startPolling();
    }

    /**
     * Called when the `Assign vehicle` button is clicked.
     * Opens the panel for assigning a vehicle to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignVehicleClick(): Promise<void>
    {
        this.stopPolling();

        await this._modalService.open(AssignVehiclePanel, { route: this.route!, assignOnSelect: true }).promise;

        this.startPolling();
    }

    /**
     * Called when the `Assign team` button is clicked.
     */
    protected async onAssignTeamClick(): Promise<void>
    {
        this.stopPolling();

        await this._modalService.open(AssignTeamPanel, { route: this.route!, assignOnSelect: true }).promise;

        this.startPolling();
    }

    /**
     * Called when the `Assign executor` button is clicked.
     * Opens the panel for assigning a executor to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignExecutorClick(): Promise<void>
    {
        this.stopPolling();

        await this._modalService.open(AssignOrganizationPanel, { route: this.route!, assignOnSelect: true }).promise;

        this.startPolling();
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
            await this.routeService.reloadRoute(this.route!);
        }
        catch (error)
        {
            Log.error("Could not reload the route", error);
        }
    }

    /**
     * Called when the `Push to drivers` button is clicked.
     * Shows a model for pushing a route to any amount of drivers.
     */
    protected async onPushToDriversClick(): Promise<void>
    {
        await this._modalService.open(PushDriversPanel, { route: this.route! }).promise;
    }

    /**
     * Called when the `Add support note` button is clicked.
     * Shows a model for adding a support note.
     */
    protected async onAddSupportNoteClick(): Promise<void>
    {
        this.stopPolling();

        await this._modalService.open(AddSupportNoteDialog, { route: this.route! }).promise;

        this.startPolling();
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
            this.stopPolling();

            await this.routeService.setRouteStatus(this.route!, status);
        }
        catch (error)
        {
            Log.error("Could not change route status", error);
        }
        finally
        {
            this.startPolling();
        }
    }

    /**
     * Called when a route stop is clicked.
     * Opens a modal showing the details of the stop.
     * @param stop The stop to edit.
     */
    protected async onStopClick(stop: RouteStop, edit: boolean): Promise<void>
    {
        this.stopPolling();

        const savedStop = await this._modalService.open(RouteStopPanel, { route: this.route!, routeStop: stop, edit }).promise;

        if (savedStop != null)
        {
            this.route!.stops.splice(this.route!.stops.indexOf(stop), 1, savedStop);
            this.route!.stops = this.route!.stops.slice();
        }

        this.startPolling();
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
            this.stopPolling();

            await this.routeService.setRouteStopStatus(this.route!, stop, "cancelled");
        }
        catch (error)
        {
            Log.error("Could not remove route stop", error);
        }
        finally
        {
            this.startPolling();
        }
    }

    /**
     * Called when a stop is moved to a new position in the list.
     * @param source The stop being moved.
     * @param target The stop currently occupying the target position.
     */
    protected onMoveStop(source: RouteStop, target: RouteStop): void
    {
        const sourceIndex = this.route!.stops.findIndex(s => s.id === source.id);
        this._targetIndex = this.route!.stops.findIndex(s => s.id === target.id);

        this.route!.stops.splice(this._targetIndex, 0, ...this.route!.stops.splice(sourceIndex, 1));
        this.route!.stops = this.route!.stops.slice();

        if (!this._isMovingStop)
        {
            this._isMovingStop = true;

            this.stopPolling();

            document.addEventListener("mouseup", async () =>
            {
                try
                {
                    if (this._targetIndex !== source.stopNumber - 1)
                    {
                        await this.routeService.moveRouteStop(this.route!, source, this._targetIndex!);
                    }
                }
                catch (error)
                {
                    Log.error("Could not move route stop", error);
                }
                finally
                {
                    this._isMovingStop = false;
                    this._targetIndex = undefined;

                    this.startPolling(false, 2000);
                }
            }, { once: true });
        }
    }

    /**
     * Called when the `Edit Information` button is clicked.
     */
    protected async onEditRouteClick(): Promise<void>
    {
        this.stopPolling();

        await this._modalService.open(EditInformationPanel, { route: this.route! }).promise;

        this.startPolling();
    }

    /**
     * Called when the `Remove driver` button is clicked.
     * @param route The route from which the driver should be removed.
     */
    protected async onRemoveDriverClick(route: Route): Promise<void>
    {
        this.stopPolling();

        await this._modalService.open(RemoveDriverPanel, { route: this.route! }).promise;

        this.startPolling();
    }

    /**
     * Called when the `Add order` button is clicked.
     * @param route The route to which an order should be added.
     */
    protected async onAddOrdersClick(): Promise<void>
    {
        this.stopPolling();

        const added = await this._modalService.open(AddOrdersPanel, { route: this.route! }).promise;

        if (added)
        {
            this.toastService.open("success", addedOrdersToast);
        }

        this.startPolling();
    }

    /**
     * Called when the `Add new stop` button is clicked, either at the bottom of the list, or between rows.
     * @param index The index at which the stop should be inserted, or undefined to append it to the list.
     */
    protected async onAddStopClick(index?: number): Promise<void>
    {
        this.stopPolling();

        let stopNumber: number;

        if (index != null)
        {
            // Index exist, 1-index it since it's stopNumber
            stopNumber = index + 1;
        }
        else
        {
            // End of list, since it's a stopNumber we add one to the list length
            stopNumber = this.route!.stops.length + 1;
        }

        const newStop = new RouteStop(undefined, stopNumber, this.route!);
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

            this.route!.stops = this.route!.stops.slice();
        }

        this.startPolling(false, 2000);
    }

    /**
     * Called when a stop is clicked on the map.
     * Scrolls to the stop that was clicked.
     * @param stop The stop that was clicked.
     */
    protected onMapStopClick(stop: RouteStop): void
    {
        const element = this.dataTableElement.querySelectorAll(".route-details-stop-number-cell")[stop.stopNumber - 2];
        element.scrollIntoView();
    }

    /**
     * Our old system uses another 'user system', Mover Transport will need some legacy features in this transition period.
     */
    protected get showLegacy(): boolean
    {
        if (ENVIRONMENT.name !== "production")
        {
            return true;
        }

        const identity = this.identityService.identity;

        if (identity == null)
        {
            return false;
        }

        const legacyOrganizationIds = [moverOrganizationId];

        return legacyOrganizationIds.includes(identity.organization!.id);
    }

    /**
     * Called by the framework when the `showMap` property changes.
     */
    protected showMapChanged(): void
    {
        this._localStateService.mutate(data =>
        {
            (data.routeDetails ??= {}).showMap = this.showMap;
        });
    }

    /**
     * Fetches the specified route and starts polling.
     * @param addToRecent True to add the rouite to the recent items list, otherwise false.
     * @param delay The time to wait before starting to fetch.
     * This is needed because the backend is eventually consistent, and may need time to update.
     */
    private startPolling(addToRecent = false, delay?: number): void
    {
        this.stopPolling();

        if (delay)
        {
            this._pollTimeout = setTimeout(() => this.startPolling(), delay);

            return;
        }

        this.fetchOperation = new Operation(async signal =>
        {
            try
            {
                this.route = await this.routeService.get(this.routeSlug, signal);

                this._router.title = this.route.slug;
                this._router.updateTitle();

                if (addToRecent)
                {
                    addToRecentEntities(this.route.toEntityInfo());
                }
            }
            catch (error)
            {
                // Only show error initially
                if (!(error instanceof AbortError) && this.route == null)
                {
                    Log.error("An error occurred while loading this route.", error);
                }
            }
            finally
            {
                if (this.route != null && this.route.status.slug === "in-progress")
                {
                    this._pollTimeout = setTimeout(() => this.startPolling(), 6000);
                }
                else
                {
                    this._pollTimeout = setTimeout(() => this.startPolling(), 30000);
                }
            }
        });
    }

    /**
     * Stops polling and aborts any pending fetch request.
     */
    private stopPolling(): void
    {
        this.fetchOperation?.abort();
        clearTimeout(this._pollTimeout);
    }
}
