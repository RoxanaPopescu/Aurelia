import { autoinject, observable } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { OrderGroupService, OrderGroup } from "app/model/order-group";
import { Consignor } from "app/model/outfit";
import { DeleteOrderGroupDialog } from "./modals/confirm-delete/confirm-delete";
import { OrganizationService } from "app/model/organization";
import { IdentityService } from "app/services/identity";

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
     * @param orderGroupsService The `OrderGroupService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(orderGroupsService: OrderGroupService, historyHelper: HistoryHelper, organizationService: OrganizationService, modalService: ModalService, identityService: IdentityService)
    {
        this._orderGroupsService = orderGroupsService;
        this._historyHelper = historyHelper;
        this._organizationService = organizationService;
        this._modalService = modalService;
        this._identityService = identityService;
        this._constructed = true;
    }

    private readonly _orderGroupsService: OrderGroupService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _organizationService: OrganizationService;
    private readonly _modalService: ModalService;
    private readonly _identityService: IdentityService;
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
     * The text in the filter text input.
     */
    @observable({ changeHandler: "update" })
    protected textFilter: string | undefined;

    /**
     * The organizations for which order groups should be shown.
     */
    @observable({ changeHandler: "update" })
    protected organizationsFilter: Consignor[] = [];

    /**
     * The tags for which order groups should be shown.
     */
    @observable({ changeHandler: "update" })
    protected tagFilter: string[] = [];

    /**
     * The items to present in the table.
     */
    protected orderGroups: OrderGroup[];

    /**
     * The organizations to show in the filter.
     */
    protected organizations: Consignor[];

    /**
     * The tags to show in the filter.
     */
    protected tags: string[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this.paging.page = params.page || this.paging.page;
        this.paging.pageSize = params.pageSize || this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;

        this.update();

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            const connections = await this._organizationService.getConnections();
            this.organizations = connections.map(c => new Consignor({ id: c.organization.id, companyName: c.organization.name }));
            this.organizations.push(this._identityService.identity!.organization!);
        })();
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
            const result = await this._orderGroupsService.getAll(
                {
                    text: this.textFilter,
                    consignorIds: this.organizationsFilter.map(c => c.id),
                    tags: this.tagFilter
                },
                this.sorting,
                this.paging,
                signal);

            // Update the state.
            this.orderGroups = result;

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
        });
    }

    /**
     * Called when the "Delete" button is clicked on a order group item.
     * Deletes the order group.
     * @param orderGroup The order group to delete.
     */
    protected async onDeleteClick(orderGroup: OrderGroup): Promise<void>
    {
        const confirmed = await this._modalService.open(DeleteOrderGroupDialog, orderGroup).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._orderGroupsService.delete(orderGroup);

            this.orderGroups.splice(this.orderGroups.indexOf(orderGroup), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the order group", error);
        }
    }
}
