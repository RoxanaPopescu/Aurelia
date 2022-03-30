import { autoinject, observable } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll } from "shared/framework";
import { RoutePlanService, RoutePlanInfo, RoutePlanStatusSlug } from "app/model/route-plan";
import { DateTime } from "luxon";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: string;
    pageSize?: string;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    textFilter?: string;
    statusFilter?: string;
    fromDateFilter?: string;
    toDateFilter?: string;
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
     * The min date for which created from plans should be shown.
     */
    @observable({ changeHandler: "update" })
    protected createdDateFromFilter: DateTime | undefined;

    /**
     * The max date for which created from plans should be shown.
     */
    @observable({ changeHandler: "update" })
    protected createdDateToFilter: DateTime | undefined;

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
     * True if initial loading failed
     */
    protected failed: boolean = false;

    /**
     * The items to present in the table.
     */
    protected results: RoutePlanInfo[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this.paging.page = params.page != null ? parseInt(params.page) : this.paging.page;
        this.paging.pageSize = params.pageSize != null ? parseInt(params.pageSize) : this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.textFilter = params.textFilter || this.textFilter;
        this.statusFilter = params.statusFilter ? params.statusFilter.split(",") as any : this.statusFilter;
        this.createdDateFromFilter = params.fromDateFilter ? DateTime.fromISO(params.fromDateFilter, { setZone: true }) : undefined;
        this.createdDateToFilter = params.toDateFilter ? DateTime.fromISO(params.toDateFilter, { setZone: true }) : undefined;

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
     * Called when the from date changes.
     * Ensures the to date remains valid.
     */
    protected onCreatedDateFromChanged(): void
    {
        if (this.createdDateFromFilter && this.createdDateToFilter && this.createdDateToFilter.valueOf() < this.createdDateFromFilter.valueOf())
        {
            this.createdDateToFilter = this.createdDateFromFilter;
        }
    }

    /**
     * Called when the from date changes.
     * Ensures the to date remains valid.
     */
    protected onCreatedDateToChanged(): void
    {
        if (this.createdDateFromFilter && this.createdDateToFilter && this.createdDateToFilter.valueOf() < this.createdDateFromFilter.valueOf())
        {
            this.createdDateFromFilter = this.createdDateToFilter;
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
            try
            {
                this.failed = false;

                // Fetch the data.
                const result = await this._routePlanService.getAll(
                    {
                        createdDateFrom: this.createdDateFromFilter,
                        createdDateTo: this.createdDateToFilter?.endOf("day"),
                        searchQuery: this.textFilter,
                        statuses: this.statusFilter
                    },
                    this.paging,
                    signal);

                // Update the state.
                this.results = result.plans;

                // Reset page.
                if (propertyName !== "paging")
                {
                    this.paging.page = 1;
                }

                // Scroll to top.
                this.scroll?.reset();

                // tslint:disable-next-line: no-floating-promises
                this._historyHelper.navigate((state: IHistoryState) =>
                {
                    state.params.page = this.paging.page;
                    state.params.pageSize = this.paging.pageSize;
                    state.params.sortProperty = this.sorting.property;
                    state.params.sortDirection = this.sorting.direction;
                    state.params.textFilter = this.textFilter;
                    state.params.statusFilter = this.statusFilter?.join(",") || undefined;
                    state.params.fromDateFilter = this.createdDateFromFilter?.toISO();
                    state.params.toDateFilter = this.createdDateToFilter?.toISO();
                },
                { trigger: false, replace: true });
            }
            catch (error)
            {
                this.failed = true;
                Log.error("An error occurred while loading the list.", error);
            }
        });
    }
}
