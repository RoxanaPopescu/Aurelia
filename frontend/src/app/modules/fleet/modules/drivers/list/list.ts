import { autoinject, observable } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { DriverService, Driver } from "app/model/driver";
import { DeleteDriverDialog } from "./modals/confirm-delete/confirm-delete";
import { DriverStatusSlug } from "app/model/driver/entities/driver-status";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    searchQuery?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param driverService The `DriverService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(driverService: DriverService, historyHelper: HistoryHelper, modalService: ModalService)
    {
        this._driverService = driverService;
        this._historyHelper = historyHelper;
        this._modalService = modalService;
        this._constructed = true;
    }

    private readonly _driverService: DriverService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _modalService: ModalService;
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
        property: "name",
        direction: "ascending"
    };

    /**
     * The paging to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected paging: IPaging =
    {
        page: 1,
        pageSize: 50
    };

    /**
     * The text in the search text input.
     */
    @observable({ changeHandler: "update" })
    protected searchQuery: string | undefined;

    /**
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "update" })
    protected statusFilter: DriverStatusSlug[] | undefined;

    /**
     * The items to present in the table.
     */
    protected results: Driver[];

    /**
     * True if initial loading failed
     */
    protected failed: boolean = false;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IRouteParams): Promise<void>
    {
        this.paging.page = params.page || this.paging.page;
        this.paging.pageSize = params.pageSize || this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;

        this.update();
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
     * Called when the `Remove driver` icon is clicked on a driver.
     * Asks the user to confirm, then deletes driver
     * @param driver The driver to remove.
     */
    protected async onRemoveDriverClick(driver: Driver): Promise<void>
    {
        const confirmed = await this._modalService.open(DeleteDriverDialog, driver).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._driverService.delete(driver.id);
            this.results.splice(this.results.indexOf(driver), 1);
        }
        catch (error)
        {
            Log.error("Could not remove the driver", error);
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
                const data = await this._driverService.getAll(
                    this.sorting,
                    this.paging,
                    {
                        searchQuery: this.searchQuery,
                        statuses: this.statusFilter
                     },
                    signal);

                // Update the state.
                this.results = data.results;

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
                    state.params.sortProperty = this.sorting ? this.sorting.property : undefined;
                    state.params.sortDirection = this.sorting ? this.sorting.direction : undefined;
                },
                { trigger: false, replace: true });
            } catch (error) {
                this.failed = true;
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}
