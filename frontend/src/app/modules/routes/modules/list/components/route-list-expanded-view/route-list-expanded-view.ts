import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { Route, RouteService, RouteStop } from "app/model/route";
import { Duration } from "luxon";
import { Collo } from "app/model/collo";
import { IdentityService } from "app/services/identity";
import { ModalService, ToastService } from "shared/framework";
import { Operation } from "shared/utilities";
import { AbortError } from "shared/types";
import { Log } from "shared/infrastructure";
import { RouteStatus, RouteStatusSlug } from "app/model/route";
import { AssignDriverPanel } from "../../../../modals/assign-driver/assign-driver";
import { AssignOrganizationPanel } from "../../../../modals/assign-organization/assign-organization";
import { moverOrganizationId } from "app/services/identity";
import { AddSupportNoteDialog } from "../../../details/modals/add-support-note/add-support-note";
import { AssignVehiclePanel } from "../../../../modals/assign-vehicle/assign-vehicle";
import { PushDriversPanel } from "../../../../modals/push-drivers/push-drivers";
import { EditInformationPanel } from "../../../details/modals/edit-information/edit-information";
import { RemoveDriverPanel } from "../../../details/modals/remove-driver/remove-driver";
import { AddOrdersPanel } from "../../../details/modals/add-orders/add-orders";
import { AssignTeamPanel } from "../../../../modals/assign-team/assign-team";
import addedOrdersToast from "../../../details/resources/strings/added-orders-toast.json";

/**
 * Represents the module.
 */
@autoinject
export class RouteListExpandedViewCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param toastService The `ToastService` instance.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(
            routeService: RouteService,
            modalService: ModalService,
            identityService: IdentityService,
            toastService: ToastService)
        {
            this.routeService = routeService;
            this._modalService = modalService;
            this.toastService = toastService;
            this.identityService = identityService;
        }

        private readonly _modalService: ModalService;
        private _pollTimeout: any;

        protected readonly routeService: RouteService;
        protected readonly toastService: ToastService;
        protected readonly identityService: IdentityService;
        protected readonly environment = ENVIRONMENT.name;

    /**
     * The Id of the route to present.
     */
    @bindable
    public routeSlug: string;

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
     * The next stop on the route, or undefined if the route is not loaded,
     * or if all stops have been visited or cancelled.
     */
    @computedFrom("route")
    public get nextStop(): RouteStop | undefined
    {
        return this.route?.nextStop;
    }

    /**
     * Counts the number of picked up colli on the route
     */
    @computedFrom("route.stops.length")
    public get pickedUpColliCount(): number | undefined
    {
        if (this.route == null)
        {
            return undefined;
        }

        let pickedUpColliCount = 0;

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "completed")
                .forEach((s: RouteStop) =>
                {
                    s.pickups.forEach(p => p.colli.forEach(c =>
                    {
                        if (c.status.slug !== "no-action" && c.status.slug !== "not-picked-up")
                        {
                            pickedUpColliCount++;
                        }
                    }));
                });
        }

        return pickedUpColliCount;
    }

    /**
     * Counts the number of delivered colli on the route
     */
    @computedFrom("route.stops.length")
    public get deliveredColliCount(): number | undefined
    {
        if (this.route == null)
        {
            return undefined;
        }

        let deliveredColliCount = 0;

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "completed")
                .forEach((s: RouteStop) =>
                {
                    s.deliveries.forEach(p => p.colli.forEach(c =>
                    {
                        if (c.status.slug === "delivered")
                        {
                            deliveredColliCount++;
                        }
                    }));
                });
        }

        return deliveredColliCount;
    }

    /**
     * Counts the number of colli on the route
     */
    @computedFrom("route.stops.length")
    public get totalColliCount(): number | undefined
    {
        if (this.route == null)
        {
            return undefined;
        }

        let totalColliCount = 0;

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .forEach((s: RouteStop) =>
                {
                    s.pickups.forEach(p => totalColliCount += p.colli.length);
                });
        }

        return totalColliCount;
    }

    /**
     * Counts the number of colli on completed stops
     */
    @computedFrom("route.stops.length")
    public get completedColliCount(): number | undefined
    {
        if (this.route == null)
        {
            return undefined;
        }

        let totalColliCount = 0;

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "completed")
                .forEach((s: RouteStop) =>
                {
                    s.pickups.forEach(p => totalColliCount += p.colli.length);
                });
        }

        return totalColliCount;
    }

    /**
     * Counts the number of stops not cancelled
     */
    @computedFrom("route.stops.length")
    public get notCancelledStops(): number | undefined
    {
        if (this.route == null)
        {
            return undefined;
        }

        let stopsCount = 0;

        if (this.route != null)
        {
            stopsCount = this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug !== "cancelled").length;
        }

        return stopsCount;
    }

    /**
     * Counts the number of completed stops
     */
    @computedFrom("route.stops.length")
    public get completedStops(): number | undefined
    {
        if (this.route == null)
        {
            return undefined;
        }

        let completedStops = 0;

        if (this.route != null)
        {
            completedStops = this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "completed").length;
        }

        return completedStops;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length", "route.completedTime")
    public get routeDuration(): Duration | undefined
    {
        if (this.route == null)
        {
            return undefined;
        }

        let duration = Duration.fromMillis(0);

        if ((this.route.stops[0] as RouteStop).arrivedTime != null)
        {
            const from = (this.route.stops[0] as RouteStop).arrivedTime!;

            if (this.route.completedTime != null)
            {
                duration = this.route.completedTime.diff(from);
            }
            else
            {
                const lastStop = this.route.stops[this.route.stops.length - 1];

                if (lastStop instanceof RouteStop && lastStop.estimates != null)
                {
                    duration = lastStop.estimates.completionTime.diff(from);
                }
            }
        }

        return duration.get("seconds") > 0 ? duration : undefined;
    }

    @computedFrom("route.stops.length", "route.estimates.completionTime")
    public get routeDelay(): Duration | undefined
    {
        if (this.route == null || this.route.estimates == null)
        {
            return undefined;
        }

        const notCancelledStops = this.route.stops.filter(s => s.status.slug !== "cancelled");
        const lastStop = notCancelledStops[notCancelledStops.length - 1] as RouteStop;
        const completionTime = this.route.estimates.completionTime;

        if (lastStop.arrivalTimeFrame.to != null &&
            completionTime != null &&
            lastStop.arrivalTimeFrame.to.diff(completionTime).as("second") > 0)
        {
            return lastStop.arrivalTimeFrame.to.diff(completionTime);
        }

        return undefined;
    }

    @computedFrom("route.stops.driverOnline")
    public get driverOnline(): boolean | undefined
    {
        if (this.route != null)
        {
            return this.route.driverOnline;
        }

        return undefined;
    }

    @computedFrom("route.stops.length")
    public get totalLoadingDuration(): Duration
    {
        const totalLoadingDuration = Duration.fromMillis(0);

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .forEach((s: RouteStop) =>
                {
                    if (s.status.slug === "completed" && s.taskTime != null)
                    {
                        totalLoadingDuration.plus(s.taskTime);
                    }
                });
        }

        return totalLoadingDuration;
    }

    /**
     * The time the driver arrived too early at the first stop.
     */
    @computedFrom("route.status")
    public get earlyStart(): Duration | undefined
    {
        if (this.route != null && this.route.stops[0] instanceof RouteStop)
        {
            if (this.route.stops[0].arrivedTime != null)
            {
                if (this.route.stops[0].arrivalTimeFrame.from != null &&
                    this.route.stops[0].arrivalTimeFrame.from.diff(this.route.stops[0].arrivedTime).as("second") > 0)
                {
                    return this.route.stops[0].arrivalTimeFrame.from.diff(this.route.stops[0].arrivedTime);
                }
                if (this.route.stops[0].arrivalTimeFrame.to != null &&
                    this.route.stops[0].arrivalTimeFrame.to.diff(this.route.stops[0].arrivedTime).as("second") > 0)
                {
                    return this.route.stops[0].arrivalTimeFrame.to.diff(this.route.stops[0].arrivedTime);
                }
            }
        }

        return undefined;
    }

    @computedFrom("route.stops.length")
    public get routeStopsOkay(): boolean
    {
        if (this.route != null)
        {
            return this.route.stops.filter(s =>
                s.status.slug === "cancelled" ||
                s.status.slug === "failed").length === 0;
        }

        return false;
    }

    /**
     * The colli that failed to be picked up on stops that have been completed.
     */
    @computedFrom("route.stops.length")
    public get notPickedUpColli(): Collo[]
    {
        const notPickedUpColli: Collo[] = [];

        if (this.route != null)
        {
            const completedPickupStops = this.route.stops
                .filter(s => s.type.slug === "pickup" && s.status.slug === "completed" && s instanceof RouteStop);

            completedPickupStops.forEach((s: RouteStop) =>
            {
                s.pickups.forEach(p =>
                {
                    p.colli.forEach(c =>
                    {
                        if (c.status.slug === "no-action" || c.status.slug === "not-picked-up")
                        {
                            notPickedUpColli.push(c);
                        }
                    });
                });
            });
        }

        return notPickedUpColli;
    }

    /**
     * The colli that failed to be delivered on stops that have been visited.
     */
    @computedFrom("route.stops.length")
    public get notDeliveredColli(): Collo[]
    {
        const notPickedUpColli = this.notPickedUpColli;
        const notDeliveredColli: Collo[] = [];

        if (this.route != null)
        {
            const stopsToConsider = this.route.stops
                .filter(s => s.type.slug === "delivery" && (s.status.slug !== "not-visited" && s.status.slug !== "arrived") && s instanceof RouteStop);

            stopsToConsider.forEach((s: RouteStop) =>
            {
                s.pickups.forEach(p =>
                {
                    p.colli.forEach(c =>
                    {
                        if (c.status.slug !== "delivered" && !notPickedUpColli.includes(c))
                        {
                            notDeliveredColli.push(c);
                        }
                    });
                });
            });
        }

        return notDeliveredColli;
    }

    /**
     * Calculates the amount failed stops
     */
    @computedFrom("route.stops.length")
    public get failedStops(): RouteStop[]
    {
        if (this.route != null)
        {
            return this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "failed") as RouteStop[];
        }

        return [];
    }

    /**
     * Calculates the amount failed stops
     */
    @computedFrom("route.stops.length")
    public get failedCancelledStops(): RouteStop[]
    {
        if (this.route != null)
        {
            return this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "failed" || s.status.slug === "cancelled") as RouteStop[];
        }

        return [];
    }

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this.fetchRoute();
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        clearTimeout(this._pollTimeout);

        this.route = undefined;
    }

    /**
     * Called when the `Assign driver` button is clicked.
     * Opens the panel for assigning a driver to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignDriverClick(): Promise<void>
    {
        const driver = await this._modalService.open(
            AssignDriverPanel,
            { route: this.route!, assignOnSelect: true }
        ).promise;

        if (driver != null)
        {
            this.fetchRoute();
        }
    }

    /**
     * Called when the `Assign vehicle` button is clicked.
     * Opens the panel for assigning a vehicle to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignVehicleClick(): Promise<void>
    {
        const vehicle = await this._modalService.open(
            AssignVehiclePanel,
            { route: this.route!, assignOnSelect: true }
        ).promise;

        if (vehicle != null)
        {
            this.fetchRoute();
        }
    }

    /**
     * Called when the `Assign team` button is clicked.
     */
    protected async onAssignTeamClick(): Promise<void>
    {
        const team = await this._modalService.open(
            AssignTeamPanel,
            { route: this.route!, assignOnSelect: true }
        ).promise;

        if (team != null)
        {
            this.fetchRoute();
        }
    }

    /**
     * Called when the `Assign executor` button is clicked.
     * Opens the panel for assigning a executor to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignExecutorClick(): Promise<void>
    {
        const organization = await this._modalService.open(
            AssignOrganizationPanel,
            { route: this.route!, assignOnSelect: true }
        ).promise;

        if (organization != null)
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
            await this.routeService.setRouteStatus(this.route!, status);

            this.fetchRoute();
        }
        catch (error)
        {
            Log.error("Could not change route status", error);
        }
    }

    /**
     * Called when the `Edit Information` button is clicked.
     */
    protected async onEditRouteClick(): Promise<void>
    {
        await this._modalService.open(EditInformationPanel, { route: this.route! }).promise;
    }

    /**
     * Called when the `Remove driver` button is clicked.
     * @param route The route from which the driver should be removed.
     */
    protected async onRemoveDriverClick(route: Route): Promise<void>
    {
        await this._modalService.open(RemoveDriverPanel, { route: this.route! }).promise;
    }

    /**
     * Called when the `Add order` button is clicked.
     * @param route The route to which an order should be added.
     */
    protected async onAddOrdersClick(): Promise<void>
    {
        const added = await this._modalService.open(AddOrdersPanel, { route: this.route! }).promise;

        if (added)
        {
            this.toastService.open("success", addedOrdersToast);
        }
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
     * Fetches the specified route.
     */
    private fetchRoute(): void
    {
        clearTimeout(this._pollTimeout);

        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        this.fetchOperation = new Operation(async signal =>
        {
            try
            {
                this.route = await this.routeService.get(this.routeSlug, signal);
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
                    this._pollTimeout = setTimeout(() => this.fetchRoute(), 6000);
                }
                else
                {
                    this._pollTimeout = setTimeout(() => this.fetchRoute(), 30000);
                }
            }
        });
    }
}
