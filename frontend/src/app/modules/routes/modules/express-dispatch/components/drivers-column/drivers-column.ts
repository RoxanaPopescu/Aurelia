import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { IScroll, ModalService } from "shared/framework";
import { ISorting, AbortError } from "shared/types";
import { Operation } from "shared/utilities";
import { ExpressRouteService, DriverRoute } from "app/model/express-route";
import { Duration, DateTime } from "luxon";
import { Workspace } from "../../services/workspace";
import { ConfirmReleaseRouteDialog } from "./modals/confirm-release-route/confirm-release-route";
import { Log } from "shared/infrastructure";

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
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService, routeService: ExpressRouteService)
    {
        this._modalService = modalService;
        this._expressRouteService = routeService;
    }

    private readonly _modalService: ModalService;
    private readonly _expressRouteService: ExpressRouteService;
    private _updateTimeoutHandle: any;

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
     * The sorting to use for the table.
     */
    protected sorting: ISorting =
    {
        property: "completionTime",
        direction: "ascending"
    };

    /**
     * The text in the filter text input.
     */
    protected textFilter: string | undefined;

    @computedFrom("workspace.driverRoutes", "textFilter", "sorting")
    protected get orderedAndFilteredItems(): DriverRoute[]
    {
        if (this.workspace.driverRoutes == null)
        {
            return [];
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this.workspace.driverRoutes
            .filter(r => !this.textFilter || r.searchModel.contains(this.textFilter))
            .sort((a, b) =>
            {
                // tslint:disable: no-eval
                let aPropertyValue = eval(`a.${this.sorting.property}`);
                let bPropertyValue = eval(`b.${this.sorting.property}`);
                // tslint:enable

                if (aPropertyValue instanceof Duration || aPropertyValue instanceof DateTime)
                {
                    aPropertyValue = aPropertyValue.valueOf();
                }
                if (typeof aPropertyValue === "object")
                {
                    aPropertyValue = aPropertyValue.toString();
                }

                if (bPropertyValue instanceof Duration || bPropertyValue instanceof DateTime)
                {
                    bPropertyValue = bPropertyValue.valueOf();
                }
                if (typeof bPropertyValue === "object")
                {
                    bPropertyValue = bPropertyValue.toString();
                }

                // Sort by selected column and direction.
                if (aPropertyValue < bPropertyValue) { return -offset; }
                if (aPropertyValue > bPropertyValue) { return offset; }

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
     * @returns A promise that will be resolved when the module is activated.
     */
    public async attached(): Promise<void>
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
