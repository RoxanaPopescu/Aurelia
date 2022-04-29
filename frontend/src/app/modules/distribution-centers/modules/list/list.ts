import { autoinject, computedFrom, observable } from "aurelia-framework";
import { AbortError, ISorting, SortingDirection } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log, HistoryHelper, IHistoryState } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { DistributionCenterService, DistributionCenter } from "app/model/distribution-center";
import { EditDistributionCenterPanel } from "./modals/edit-distribution-center/edit-distribution-center";
import { ConfirmDeleteDistributionCenterDialog } from "./modals/confirm-delete-distribution-center/confirm-delete-distribution-center";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    sortProperty?: string;
    sortDirection?: SortingDirection;
    text?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     * @param distributionCenterService The `DistributionCenterService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(modalService: ModalService, distributionCenterService: DistributionCenterService, historyHelper: HistoryHelper)
    {
        this._modalService = modalService;
        this._distributionCenterService = distributionCenterService;
        this._historyHelper = historyHelper;
    }

    private readonly _modalService: ModalService;
    private readonly _distributionCenterService: DistributionCenterService;
    private readonly _historyHelper: HistoryHelper;
    private _distributionCenters: DistributionCenter[] | undefined;

    /**
     * The most recent operation.
     */
    protected operation: Operation;

    /**
     * The text filter to apply, if any.
     */
    @observable
    protected textFilter: string | undefined;

    /**
     * The sorting to use for the table.
     */
    @observable
    protected sorting: ISorting =
    {
        property: "name",
        direction: "ascending"
    };

    /**
     * The distribution centers to present in the table.
     */
    @computedFrom("_distributionCenters.length", "sorting", "textFilter")
    protected get orderedAndFilteredDistributionCenters(): DistributionCenter[] | undefined
    {
        if (this._distributionCenters == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this._distributionCenters

            // Filtering
            .filter(distributionCenter => !this.textFilter || distributionCenter.searchModel.contains(this.textFilter))

            // Sorting
            .sort((a, b) =>
            {
                const aPropertyValue = getPropertyValue(a, this.sorting.property)?.toString();
                const bPropertyValue = getPropertyValue(b, this.sorting.property)?.toString();

                // Sort by selected column and direction.
                if (aPropertyValue < bPropertyValue) { return -offset; }
                if (aPropertyValue > bPropertyValue) { return offset; }

                return 0;
            });
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.textFilter = params.text || this.textFilter;

        this.fetch();
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        this.operation?.abort();
    }

    /**
     * Called by the framework when the `textFilter` property changes.
     */
    public textFilterChanged(): void
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
    public sortingChanged(): void
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
     * Fetches the latest data.
     */
    protected fetch(): void
    {
        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this._distributionCenters = await this._distributionCenterService.getAll(signal);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the distribution centers", error);
            }
        });
    }

    /**
     * Called when the `New distribution center` button is clicked.
     * Opens a modal for creating a new distribution center.
     */
    protected async onNewDistributionCenterClick(): Promise<void>
    {
        const newDistributionCenter = await this._modalService.open(EditDistributionCenterPanel, { distributionCenters: this._distributionCenters }).promise;

        if (newDistributionCenter != null)
        {
            this._distributionCenters!.push(newDistributionCenter);
        }
    }

    /**
     * Called when the `Edit` icon is clicked on a distribution center.
     * Opens a modal for editing the distribution center.
     * @param distributionCenter The distribution center to edit.
     */
    protected async onEditDistributionCenterClick(distributionCenter: DistributionCenter): Promise<void>
    {
        const newDistributionCenter = await this._modalService.open(EditDistributionCenterPanel, { distributionCenter, distributionCenters: this._distributionCenters }).promise;

        if (newDistributionCenter != null)
        {
            this._distributionCenters!.splice(this._distributionCenters!.indexOf(distributionCenter), 1, newDistributionCenter);
        }
    }

    /**
     * Called when the `Delete` icon is clicked on a distribution center.
     * Asks for confirmation, then deletes the distribution center.
     * @param distributionCenter The distribution center to delete.
     */
    protected async onDeleteDistributionCenterClick(distributionCenter: DistributionCenter): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeleteDistributionCenterDialog, distributionCenter).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._distributionCenterService.delete(distributionCenter.id);

            this._distributionCenters!.splice(this._distributionCenters!.indexOf(distributionCenter), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the distribution center", error);
        }
    }
}
