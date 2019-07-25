import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { IScroll } from "shared/framework";
import { Operation, ISorting } from "shared/types";
import { ExpressRouteService, ExpressRoute } from "app/model/express-route";
import { Duration, DateTime } from "luxon";
import { Workspace } from "../../services/workspace";

/**
 * The time between each update of the list.
 */
const updateInterval = 999999;

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
    protected _selectionCounter = 0;

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

    @computedFrom("workspace.expressRoutes", "textFilter", "sorting", "_selectionCounter")
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
                if (!b.selected && a.selected) { return -offset; }
                if (b.selected && !a.selected) { return offset; }

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
    protected update(newValue?: any, oldValue?: any, propertyName?: string): void
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
                const result = await this._expressRouteService.getExpressRoutes(signal);

                // Migrate the state to the new routes.
                if (this.workspace.expressRoutes != null)
                {
                    for (const item of this.workspace.expressRoutes)
                    {
                        item.migrateState(result.routes.find(r => r.id === item.id));
                    }
                }

                // Update the state.
                this.workspace.expressRoutes = result.routes;
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
            this.workspace.selectedExpressRoutes.splice(this.workspace.selectedExpressRoutes.indexOf(item), 1);
        }

        this.workspace.expressRoutes = this.workspace.expressRoutes.slice();
        this.workspace.selectedExpressRoutes = this.workspace.selectedExpressRoutes.slice();

        this._selectionCounter++;
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

        this._selectionCounter++;
    }
}
