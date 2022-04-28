import { autoinject, computedFrom, observable } from "aurelia-framework";
import { AbortError, ISorting, SortingDirection } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log, HistoryHelper, IHistoryState } from "shared/infrastructure";
import { ModalService, ToastService } from "shared/framework";
import { DistributionCenterService, DistributionCenter, DistributionCenterRoute } from "app/model/distribution-center";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";
import { DateTime } from "luxon";
import { DistributionCenterRouteRemarksDialog } from "./modals/distribution-center-route-remarks/distribution-center-route-remarks";

// The interval at which routes are fetched, in milliseconds.
const pollInterval = 10000;

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    id: string;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    text?: string;
    date?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     * @param toastService The `ToastService` instance.
     * @param distributionCenterService The `DistributionCenterService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(modalService: ModalService, toastService: ToastService, distributionCenterService: DistributionCenterService, historyHelper: HistoryHelper)
    {
        this._modalService = modalService;
        this._toastService = toastService;
        this._distributionCenterService = distributionCenterService;
        this._historyHelper = historyHelper;
    }

    protected readonly _modalService: ModalService;
    protected readonly _toastService: ToastService;
    private readonly _distributionCenterService: DistributionCenterService;
    private readonly _historyHelper: HistoryHelper;
    private _distributionCenterId: string;
    private _routes: DistributionCenterRoute[] | undefined;
    private _pollTimeout: any;

    /**
     * The distribution center to present.
     */
    protected distributionCenter: DistributionCenter;

    /**
     * The most recent operation.
     */
    protected operation: Operation;

    /**
     * True if the list should appear as busy, otherwise false.
     */
    protected busy = true;

    /**
     * The text filter to apply, if any.
     */
    @observable
    protected textFilter: string | undefined;

    /**
     * The date for which to show routes, or undefined to show routes for the next 24 hours.
     */
    @observable
    protected dateFilter: DateTime;

    /**
     * The sorting to use for the table.
     */
    @observable
    protected sorting: ISorting =
    {
        property: "plannedArrival",
        direction: "ascending"
    };

    /**
     * The users to present in the table.
     */
    @computedFrom("_routes.length", "sorting", "textFilter")
    protected get orderedAndFilteredRoutes(): DistributionCenterRoute[] | undefined
    {
        if (this._routes == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this._routes

            // Filtering
            .filter(route => !this.textFilter || route.searchModel.contains(this.textFilter))

            // Sorting
            .sort((a, b) =>
            {
                const aPropertyValue = getPropertyValue(a, this.sorting.property);
                const bPropertyValue = getPropertyValue(b, this.sorting.property);

                // Sort by selected column and direction.
                if ((aPropertyValue == null && bPropertyValue != null) || aPropertyValue < bPropertyValue) { return -offset; }
                if ((aPropertyValue != null && bPropertyValue == null) || aPropertyValue > bPropertyValue) { return offset; }

                return 0;
            });
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this._distributionCenterId = params.id;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.textFilter = params.text || this.textFilter;
        this.dateFilter = params.date ? DateTime.fromISO(params.date, { setZone: true }) : DateTime.utc().startOf("day");

        this.fetch(params.id, true, true);
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        this.operation?.abort();

        // Stop polling.
        clearTimeout(this._pollTimeout);
    }

    /**
     * Called by the framework when the `textFilter` property changes.
     */
    protected textFilterChanged(): void
    {
        // tslint:disable-next-line: no-floating-promises
        this._historyHelper?.navigate((state: IHistoryState) =>
        {
            state.params.text = this.textFilter || undefined;
        },
        { trigger: false, replace: true });
    }

    /**
     * Called by the framework when the `sorting` property changes.
     */
    protected sortingChanged(): void
    {
        // tslint:disable-next-line: no-floating-promises
        this._historyHelper?.navigate((state: IHistoryState) =>
        {
            state.params.sortProperty = this.sorting?.property || undefined;
            state.params.sortDirection = this.sorting?.direction || undefined;
        },
        { trigger: false, replace: true });
    }

    /**
     * Called by the framework when the `dateFilter` property changes.
     */
    protected dateFilterChanged(): void
    {
        if (this.dateFilter == null)
        {
            this.dateFilter = DateTime.utc().startOf("day");
        }
        else if (this.dateFilter.valueOf() !== this.dateFilter.startOf("day").valueOf())
        {
            this.dateFilter = this.dateFilter?.startOf("day");
        }
        else
        {
            // tslint:disable-next-line: no-floating-promises
            this._historyHelper?.navigate((state: IHistoryState) =>
            {
                state.params.date = this.dateFilter
            },
            { trigger: false, replace: true });

            this.fetch(this._distributionCenterId, true);
        }
    }

    /**
     * Called when the `Problems` cell is clicked on a route.
     * Opens the problem reporting modal.
     * @param route The route for which to open the problem reporting modal.
     */
    protected async onReportProblemClick(route: DistributionCenterRoute): Promise<void>
    {
        // Abort any existing operation.
        this.operation?.abort();

        clearInterval(this._pollTimeout);

        await this._modalService.open(DistributionCenterRouteRemarksDialog, { distributionCenterId: this._distributionCenterId, route }).promise;

        this._pollTimeout = setTimeout(() => this.fetch(this.distributionCenter.id, false), pollInterval);
    }

    /**
     * Fetches the latest data.
     * @param id The ID of the distribution center to fetch.
     * @param busy True if the list should appear busy, otherwise false.
     * @param initialFetch True if this is the initial fetch, otherwise false.
     */
    protected fetch(id: string, busy: boolean, initialFetch = false): void
    {
        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this.distributionCenter = await this._distributionCenterService.get(id, signal);

            const toDate = this.dateFilter.plus({ days: 1, milliseconds: -1 });

            this._routes = await this._distributionCenterService.getRoutes(id, this.dateFilter, toDate, signal);

            if (initialFetch)
            {
                addToRecentEntities(this.distributionCenter.toEntityInfo());
            }

            this._pollTimeout = setTimeout(() => this.fetch(id, false), pollInterval);

            this.busy = false;
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the distribution center or associated routes.", error);

                this._pollTimeout = setTimeout(() => this.fetch(id, false), pollInterval);
            }

            this.busy = false;
        });
    }
}
