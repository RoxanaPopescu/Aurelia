import { autoinject, observable } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll } from "shared/framework";
import { RoutePlanService, RoutePlanInfo, RoutePlanStatusSlug } from "app/model/route-plan";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    textFilter?: string;
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
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "update" })
    protected statusFilter: RoutePlanStatusSlug[] | undefined;


    /**
     * The text in the filter text input.
     */
    @observable({ changeHandler: "update" })
    protected textFilter: string | undefined;

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
     * If it failed loading.
     */
    protected failed: boolean = false;

    /**
     * The items to present in the table.
     */
    protected plans: RoutePlanInfo[];

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
        this.textFilter = params.textFilter || this.textFilter;

        this.update();
    }

    /**
     * Called by the list when looping through the plans
     * @returns The details link if not cancelled or failed.
     */
    public detailsLink(plan: RoutePlanInfo): string | undefined
    {
        if (plan.status.slug === "succeeded")
        {
            return `/route-planning/plans/details/${plan.slug}`;
        }

        return undefined;
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
            try {
                this.failed = false;

                // Fetch the data.
                const result = await this._routePlanService.getAll(
                    this.sorting,
                    this.paging,
                    signal);

                // Update the state.
                this.plans = result.plans;
                // FIXME: LINK OTHER INFO

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
                    state.params.textFilter = this.textFilter;
                },
                { trigger: false, replace: true });
            } catch (error) {
                this.failed = true;
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}
