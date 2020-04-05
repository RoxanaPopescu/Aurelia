import { autoinject, observable } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState } from "shared/infrastructure";
import { IScroll } from "shared/framework";
import { RoutePlanService, LegacyRoutePlanInfo } from "app/model/route-plan";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDirection?: SortingDirection;
}

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param routePlanService The `RoutePlanService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(routePlanService: RoutePlanService, historyHelper: HistoryHelper)
    {
        this._routePlanService = routePlanService;
        this._historyHelper = historyHelper;
        this._constructed = true;
    }

    private readonly _routePlanService: RoutePlanService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _constructed;

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
    @observable({ changeHandler: "update" })
    protected sorting: ISorting =
    {
        property: "created",
        direction: "descending"
    };

    /**
     * The paging to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected paging: IPaging =
    {
        page: 1,
        pageSize: 20
    };

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected planCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected plans: LegacyRoutePlanInfo[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public activate(params: IRouteParams): void
    {
        this.paging.page = params.page || this.paging.page;
        this.paging.pageSize = params.pageSize || this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;

        this.update();
    }

    /**
     * Called by the list when looping through the plans
     * @returns The details link if not cancelled or failed.
     */
    public detailsLink(plan: LegacyRoutePlanInfo): string | undefined
    {
        if (plan.status.slug === "cancelled" ||
            plan.status.slug === "failed-externally" ||
            plan.status.slug === "failed-internally")
        {
            return undefined;
        }

        return `/route-planning/details/${plan.slug}`;
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }
    }

    /**
     * Updates the page by fetching the latest data.
     */
    protected update(newValue?: any, oldValue?: any, propertyName?: string): void
    {
        // Return if the object is not constructed.
        // This is needed because the `observable` decorator calls the change handler when the
        // initial property value is set, which happens before the constructor is called.
        if (!this._constructed)
        {
            return;
        }

        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            // Fetch the data.
            const result = await this._routePlanService.legacyGetAll(
                this.sorting,
                this.paging,
                signal);

            // Update the state.
            this.plans = result.plans;
            this.planCount = result.planCount;

            // Reset page.
            if (propertyName !== "paging")
            {
                this.paging.page = 1;
            }

            // Scroll to top.
            this.scroll.reset();

            // tslint:disable-next-line: no-floating-promises
            this._historyHelper.navigate((state: IHistoryState) =>
            {
                state.params.page = this.paging.page;
                state.params.pageSize = this.paging.pageSize;
                state.params.sortProperty = this.sorting.property;
                state.params.sortDirection = this.sorting.direction;
            },
            { trigger: false, replace: true });
        });
    }
}
