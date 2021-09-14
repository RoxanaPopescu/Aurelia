import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { IScroll, ModalService, ToastService } from "shared/framework";
import { AbortError } from "shared/types";
import { Operation } from "shared/utilities";
import { ExpressRouteService, DriverRoute } from "app/model/express-route";
import { Workspace } from "../../services/workspace";
import { ConfirmReleaseRouteDialog } from "./modals/confirm-release-route/confirm-release-route";
import { Log } from "shared/infrastructure";
import { ConfirmAutomaticDispatchDialog } from "./modals/confirm-automatic-dispatch/confirm-automatic-dispatch";
import startedAutomaticDispatchToast from "./resources/strings/started-automatic-dispatch-toast.json";
import { AutomaticDispatchService } from "app/model/automatic-dispatch";

/**
 * The time between each update of the list.
 */
const updateInterval = 20000;

@autoinject
export class DriversColumnCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `ExpressRouteService` instance.
     * @param automaticDispatchService The `AutomaticDispatchService` instance.
     * @param modalService The `ModalService` instance.
     * @param toastService The `ToastService` instance.
     */
    public constructor(modalService: ModalService, routeService: ExpressRouteService, automaticDispatchService: AutomaticDispatchService, toastService: ToastService)
    {
        this._modalService = modalService;
        this._expressRouteService = routeService;
        this._automaticDispatchService = automaticDispatchService;
        this.toastService = toastService;
    }

    private readonly _modalService: ModalService;
    private readonly _expressRouteService: ExpressRouteService;
    private readonly _automaticDispatchService: AutomaticDispatchService;
    private _updateTimeoutHandle: any;
    protected readonly toastService: ToastService;

    /**
     * True during the initial load, then false.
     */
    protected loading = true;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The text in the filter text input.
     */
    protected textFilter: string | undefined;

    @computedFrom("workspace.driverRoutes", "workspace.selectedExpressRoutes", "textFilter", "sorting")
    protected get orderedAndFilteredItems(): DriverRoute[]
    {
        if (this.workspace == null || this.workspace.driverRoutes == null)
        {
            return [];
        }

        return this.workspace.driverRoutes
            .filter(r => !this.textFilter || r.searchModel.contains(this.textFilter))
            .sort((a, b) =>
            {
                // If routes are selected first sort by vehicle type
                if (this.workspace.selectedExpressRoutes.length > 0 && a.vehicle != null && b.vehicle != null)
                {
                    const vehicleTypes = this.workspace.selectedExpressRoutes.map(r => r.vehicleType);

                    // All vehicle types has to be the same if we want to filter
                    if (vehicleTypes.every((val, _, arr) => val === arr[0]))
                    {
                        const vehicleType = this.workspace.selectedExpressRoutes[0].vehicleType;
                        let allowedTypes = [vehicleType.slug];

                        if (vehicleType.slug === "van")
                        {
                            allowedTypes = ["van", "moving-van"];
                        }
                        else if (vehicleType.slug === "car")
                        {
                            allowedTypes = ["moving-van", "van", "car"];
                        }

                        const aHasVehicle = allowedTypes.includes(a.vehicle.type.slug);
                        const bHasVehicle = allowedTypes.includes(b.vehicle.type.slug);

                        if (aHasVehicle > bHasVehicle) { return -1; }
                        if (aHasVehicle < bHasVehicle) { return 1; }
                    }
                }

                // Sort by availabillity
                if (a.available > b.available) { return -1; }
                if (a.available < b.available) { return 1; }

                // Sort by payload capacity
                if (a.vehicle != null && b.vehicle != null)
                {
                    if (a.vehicle.type.maxPayloadDimensions > b.vehicle.type.maxPayloadDimensions) { return -1; }
                    if (a.vehicle.type.maxPayloadDimensions < b.vehicle.type.maxPayloadDimensions) { return 1; }
                }

                // Sort by done time
                if (a.completionTime != null && b.completionTime != null)
                {
                    const aCompletion = a.completionTime.valueOf();
                    const bCompletion = b.completionTime.valueOf();

                    if (aCompletion > bCompletion) { return -1; }
                    if (aCompletion < bCompletion) { return 1; }
                }

                // Sort by name
                if (a.driver.name > b.driver.name) { return -1; }
                if (a.driver.name < b.driver.name) { return 1; }

                return 0;
            });
    }

    /**
     * The workspace.
     */
    @bindable
    public workspace: Workspace;

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        this.update();
    }

    /**
     * Called by the framework when the component is detached from the DOM.
     */
    public detached(): void
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        // Abort any scheduled update.
        clearTimeout(this._updateTimeoutHandle);
    }

    /**
     * Updates the page by fetching the latest data.
     */
    protected update(): void
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            try
            {
                // Fetch the data.
                const result = await this._expressRouteService.getDriverRoutes(this.workspace.dateFilter, signal);

                // Migrate the state to the new routes.
                if (this.workspace.driverRoutes != null)
                {
                    for (const item of this.workspace.driverRoutes)
                    {
                        item.migrateState(result.routes.find(r => r.driver.id === item.driver.id));
                    }
                }

                // Remove selected routes that no longer exists.
                if (this.workspace.selectedDriverRoutes != null)
                {
                    for (const item of this.workspace.selectedDriverRoutes)
                    {
                        if (!result.routes.some(r => r.driver.id === item.driver.id))
                        {
                            const index = this.workspace.selectedDriverRoutes.indexOf(item);
                            this.workspace.selectedDriverRoutes.splice(index, 1);
                        }
                    }
                }

                // Update the state.
                this.workspace.driverRoutes = result.routes;

                // Indicate that the initial load succeeded.
                this.loading = false;
            }
            catch (error)
            {
                if (!(error instanceof AbortError))
                {
                    throw error;
                }
            }
            finally
            {
                this._updateTimeoutHandle = setTimeout(() => this.update(), updateInterval);
            }
        });
    }

    /**
     * Called when the selection of an item is toggled.
     * Adds or removes the item from the `selectedDriverRoutes` array.
     * @param item The item being toggled.
     * @param selected True if the item is selected, otherwise false.
     */
    protected onRowToggle(item: DriverRoute, selected: boolean): void
    {
        if (selected)
        {
            this.workspace.selectedDriverRoutes.push(item);
        }
        else
        {
            this.workspace.selectedDriverRoutes.splice(this.workspace.selectedDriverRoutes.findIndex(r => r.driver.id === item.driver.id), 1);
        }

        this.workspace.driverRoutes = this.workspace.driverRoutes.slice();
        this.workspace.selectedDriverRoutes = this.workspace.selectedDriverRoutes.slice();
    }

    /**
     * Called when the selection of all rows is toggled.
     */
    protected onToogleAll(selected: boolean): void
    {
        for (const route of this.workspace.driverRoutes)
        {
            route.selected = selected;
        }

        this.workspace.driverRoutes = this.workspace.driverRoutes.slice();
        this.workspace.selectedDriverRoutes = selected ? this.workspace.driverRoutes.slice() : [];
    }

    protected onMergeClick(): void
    {
        this.workspace.isMerging = true;
        this.workspace.tab = "info";

        history.pushState({ view: "express-dispatch-merge" }, "", location.href);
    }

    protected async onStartAutomaticDispatch(): Promise<void>
    {
        if (!await this._modalService.open(ConfirmAutomaticDispatchDialog).promise)
        {
            return;
        }

        try
        {
            const toastModel =
                {
                    heading: startedAutomaticDispatchToast.heading,
                    body: startedAutomaticDispatchToast.body,
                    url: "/routes/automatic-dispatch"
                };

            this.toastService.open("success", toastModel);

            await this._automaticDispatchService.startManual(this.workspace.selectedDriverRoutes.map(r => r.routeId), this.workspace.selectedExpressRoutes.map(r => r.id));
        }
        catch (error)
        {
            Log.error("Could not start automatic dispatch", error);
        }
    }

    protected async onReleaseClick(): Promise<void>
    {
        if (!await this._modalService.open(ConfirmReleaseRouteDialog).promise)
        {
            return;
        }

        try
        {
            this.workspace.isBusy = true;

            await this._expressRouteService.releaseExpressRoutes(this.workspace.selectedExpressRoutes.map(r => r.id));

            this.update();
        }
        catch (error)
        {
            Log.error("Could not release route", error);
        }
        finally
        {
            this.workspace.isBusy = false;
        }
    }
}
