import { autoinject, computedFrom } from "aurelia-framework";
import { IScroll } from "shared/framework";
import { Operation, ISorting } from "shared/types";
import { ExpressRouteService, ExpressRoute } from "app/model/express-route";
import { Duration, DateTime } from "luxon";

/**
 * The time between each update of the list.
 */
const updateInterval = 5000;

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
     * The total number of items matching the query, or undefined if unknown.
     */
    protected itemCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected items: ExpressRoute[];

    @computedFrom("items", "textFilter", "sorting", "_selectionCounter")
    protected get orderedAndFilteredItems(): ExpressRoute[]
    {
        if (this.items == null)
        {
            return [];
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this.items
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
                if (this.items != null)
                {
                    for (const item of this.items)
                    {
                        item.migrateState(result.routes.find(r => r.id === item.id));
                    }
                }

                // Update the state.
                this.items = result.routes;
                this.itemCount = result.routeCount;
            }
            finally
            {
                this._updateTimeoutHandle = setTimeout(() => this.update(), updateInterval);
            }
        });
    }

    /**
     * Called when the selection of a row is toggled.
     * Increments the selection counter to force the list to update.
     */
    protected onRowToggle(): void
    {
        this._selectionCounter++;
    }
}
