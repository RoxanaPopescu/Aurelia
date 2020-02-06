import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { IScroll } from "shared/framework";
import { ISorting, AbortError } from "shared/types";
import { Operation } from "shared/utilities";
import { ExpressRouteService, ExpressRoute } from "app/model/express-route";
import { Duration, DateTime } from "luxon";
import { Workspace } from "../../services/workspace";

/**
 * The time between each update of the list.
 */
const updateInterval = 20000;

@autoinject
export class RoutesColumnCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `ExpressRouteService` instance.
     */
    public constructor(routeService: ExpressRouteService)
    {
        this._expressRouteService = routeService;
    }

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
        property: "timeToDeadline",
        direction: "ascending"
    };

    /**
     * The text in the filter text input.
     */
    protected textFilter: string | undefined;

    /**
     * The workspace.
     */
    @bindable
    protected workspace: Workspace;

    @computedFrom("workspace.expressRoutes", "textFilter", "sorting")
    protected get orderedAndFilteredItems(): ExpressRoute[]
    {
        if (this.workspace.expressRoutes == null)
        {
            return [];
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this.workspace.expressRoutes
            .filter(r => !this.textFilter || r.searchModel.contains(this.textFilter))
            .sort((a, b) =>
            {
                // Sort by selected selection state.
                if (!b.selected && a.selected) { return -1; }
                if (b.selected && !a.selected) { return 1; }

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
     * Called by the framework when the component is attached to the DOM.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async attached(): Promise<void>
    {
        this.update();
    }

    /**
     * Called by the framework when the component is dettached from the DOM.
     * @returns A promise that will be resolved when the module is activated.
     */
    public dettached(): void
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
                const result = await this._expressRouteService.getExpressRoutes(this.workspace.dateFilter, signal);

                // Migrate the state to the new routes.
                if (this.workspace.expressRoutes != null)
                {
                    for (const item of this.workspace.expressRoutes)
                    {
                        item.migrateState(result.routes.find(r => r.id === item.id));
                    }
                }

                // Remove selected routes that no longer exists.
                if (this.workspace.selectedExpressRoutes != null)
                {
                    for (const item of this.workspace.selectedExpressRoutes)
                    {
                        if (!result.routes.some(r => r.id === item.id))
                        {
                            // Needed to release the color assigned to the route.
                            item.selected = false;

                            const index = this.workspace.selectedExpressRoutes.indexOf(item);
                            this.workspace.selectedExpressRoutes.splice(index, 1);
                        }
                    }
                }

                // Update the state.
                this.workspace.expressRoutes = result.routes;

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
     * Called when the selection of a row is toggled.
     */
    protected onRowToggle(item: ExpressRoute, selected: boolean): void
    {
        if (selected)
        {
            this.workspace.selectedExpressRoutes.push(item);
        }
        else
        {
            this.workspace.selectedExpressRoutes.splice(this.workspace.selectedExpressRoutes.findIndex(r => r.id === item.id), 1);
        }

        this.workspace.expressRoutes = this.workspace.expressRoutes.slice();
        this.workspace.selectedExpressRoutes = this.workspace.selectedExpressRoutes.slice();
    }

    /**
     * Called when the selection of all rows is toggled.
     */
    protected onToogleAll(selected: boolean): void
    {
        for (const route of this.workspace.expressRoutes)
        {
            route.selected = selected;
        }

        this.workspace.expressRoutes = this.workspace.expressRoutes.slice();
        this.workspace.selectedExpressRoutes = selected ? this.workspace.expressRoutes.slice() : [];
    }

    /**
     * Called when the date changes.
     */
    protected onDateChanged(): void
    {
        this.workspace.clearAllData();
        this.update();
    }
}
