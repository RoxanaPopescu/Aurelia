import { autoinject, observable } from "aurelia-framework";
import { IPaging } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll } from "shared/framework";
import { DateTime } from "luxon";
import { AutomaticDispatchJobStatusSlug, AutomaticDispatchRoutePlanInfo, AutomaticDispatchService } from "app/model/automatic-dispatch";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: number;
    pageSize?: number;
}

/**
 * Represents the page.
 */
@autoinject
export class AutomaticDispatchListPage
{
    /**
     * Creates a new instance of the class.
     * @param automaticDispatchService The `AutomaticDispatchService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(automaticDispatchService: AutomaticDispatchService, historyHelper: HistoryHelper)
    {
        this._automaticDispatchService = automaticDispatchService;
        this._historyHelper = historyHelper;
        this._constructed = true;
    }

    private readonly _automaticDispatchService: AutomaticDispatchService;
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
    protected statusFilter: AutomaticDispatchJobStatusSlug[] | undefined;

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
    protected results: AutomaticDispatchRoutePlanInfo[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this.paging.page = Number(params.page || this.paging.page);
        this.paging.pageSize = Number(params.pageSize || this.paging.pageSize);

        this.update();
    }

    /**
     * Called by the list when looping through the dispatches
     * @returns The details link if not cancelled or failed.
     */
    public detailsLink(plan: AutomaticDispatchRoutePlanInfo): string | undefined
    {
        if (plan.status.slug === "succeeded")
        {
            return `/routes/automatic-dispatch/${plan.id}`;
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
                const result = await this._automaticDispatchService.getAll(
                    {
                        createdDateFrom: this.createdDateFromFilter,
                        createdDateTo: this.createdDateToFilter?.endOf("day"),
                        statuses: this.statusFilter
                    },
                    this.paging,
                    signal);

                // Update the state.
                this.results = result;

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
                },
                { trigger: false, replace: true });
            }
            catch (error)
            {
                this.failed = true;
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}
