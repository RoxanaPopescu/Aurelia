import { DateTime } from "luxon";
import { autoinject, computedFrom, observable } from "aurelia-framework";
import { MapObject } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { LocalStateService } from "app/services/local-state";
import { ListViewService, ListViewDefinition, ListView, IListViewFilter } from "app/model/list-view";
import { ListViewType } from "app/model/list-view/entities/list-view-type";

/**
 * Represents the route parameters for the page.
 */
export interface IListViewPageParams
{
    /**
     * The ID of the view to open and activate.
     */
    view?: string;
}

/**
 * Represents the route parameters for the page.
 */
export interface IListViewPageItem
{
    /**
     * The ID of the item.
     */
    id: string;
}

/**
 * Represents the route parameters for the page.
 */
export interface IListViewPageItems
{
    /**
     * The items to present in the list.
     */
    items: any[];

    /**
     * The total number of items matching the query, if known.
     */
    itemCount: number;
}

/**
 * Represents the page.
 */
@autoinject
export abstract class ListViewsBasePage<TListViewFilter extends IListViewFilter, TListItem>
{
    /**
     * Creates a new instance of the type.
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     * @param localStateService The `LocalStateService` instance.
     * @param listViewService The `ListViewService` instance.
     */
    public constructor(historyHelper: HistoryHelper, modalService: ModalService, localStateService: LocalStateService, listViewService: ListViewService)
    {
        this._historyHelper = historyHelper;
        this._modalService = modalService;
        this._localStateService = localStateService;
        this._listViewService = listViewService;
    }

    protected readonly _historyHelper: HistoryHelper;
    protected readonly _modalService: ModalService;
    protected readonly _localStateService: LocalStateService;
    protected readonly _listViewService: ListViewService;

    /**
     * The type of list views presented by the page.
     * Implementations must override this, to specify the actual type.
     */
    protected abstract readonly listViewType: ListViewType;

    /**
     * The list view definitions.
     */
    protected listViewDefinitions:
    {
        personal: ListViewDefinition<TListViewFilter>[];
        shared: ListViewDefinition<TListViewFilter>[];
    };

    /**
     * The list views that are currently open.
     */
    protected openListViews: ListView<TListViewFilter, TListItem>[];

    /**
     * The list view that is curently active, if any.
     */
    @observable
    protected activeListView: ListView<TListViewFilter, TListItem> | undefined;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The style defining the grid template columns for the `data-table`.
     * Implementations may override this as needed, to support additional columns.
     */
    @computedFrom("activeListView.definition.columns")
    protected get tableStyle(): MapObject
    {
        return { "grid-template-columns": `${this.activeListView?.definition.columns.map(c => c.width).join(" ")}` };
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public async activate(params: IListViewPageParams): Promise<void>
    {
        // Fetch the list view definitions.

        this.listViewDefinitions = await this._listViewService.getAll(this.listViewType);

        // Get the locally stored IDs of the open list views.

        let openListViewIds = this._localStateService.get().listViews?.[this.listViewType] ?? [];

        // TODO: For debugging only.
        openListViewIds = [this.listViewDefinitions.shared[0].id];

        // Create the open list views, if any.

        this.openListViews = [];

        for (const listViewId of openListViewIds)
        {
            const listViewDefinition = this.getListViewDefinition(listViewId);

            if (listViewDefinition != null)
            {
                const listView = new ListView<TListViewFilter, TListItem>(listViewDefinition);
                this.openListViews.push(listView);
            }
        }

        // If the ID of an available list view is specified in the URL, ensure it is open and active.

        if (params.view)
        {
            const specifiedListView = this.openListViews.find(listView => listView.definition.id === params.view);

            if (specifiedListView != null)
            {
                this.activeListView = specifiedListView;
            }
            else
            {
                const listViewDefinition = this.getListViewDefinition(params.view);

                if (listViewDefinition != null)
                {
                    this.activeListView = new ListView<TListViewFilter, TListItem>(listViewDefinition);
                    this.openListViews.unshift(this.activeListView);
                }
            }
        }

        // If the ID of an available list view was not specified in the URL, activate the first open view, if any.

        if (this.activeListView == null)
        {
            this.activeListView = this.openListViews[0];
        }
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public async deactivate(): Promise<void>
    {
        // Abort any pending operations.
        for (const listView of this.openListViews)
        {
            listView.operation?.abort();
        }

        await Promise.resolve();
    }

    /**
     * Gets the list view with the specified ID, if available.
     * @param listViewId The ID of the list view to get.
     * @returns The list view with the specified ID, or undefined if not available.
     */
    protected getListViewDefinition(listViewId: string): ListViewDefinition<TListViewFilter> | undefined
    {
        const listViewDefinition =
            this.listViewDefinitions.shared.find(lvd => lvd.id === listViewId) ??
            this.listViewDefinitions.personal.find(lvd => lvd.id === listViewId);

        return listViewDefinition;
    }

    /**
     * Called when the `Close view` icon on a list view tab is clicked.
     * Closes the specified list view, and activates the first of the remaining open list views.
     * @param listView The list view to close.
     */
    protected onCloseViewClick(listView: ListView<TListViewFilter, TListItem>): void
    {
        this.openListViews.splice(this.openListViews.indexOf(listView), 1);

        if (this.activeListView === listView)
        {
            this.activeListView = this.openListViews[0];
        }
    }

    /**
     * Called when an item in the list is clicked.
     * Toggles the expanded state of the item.
     * Implementations may override this, to change this behavior.
     * @param item The item that was clicked.
     */
    protected onItemClick(item: IListViewPageItem): void
    {
        this.activeListView!.expandedItemId = this.activeListView!.expandedItemId === item.id ? undefined : item.id;
    }

    /**
     * Called by the framework when the `activeListView` property changes.
     * Updates the URL to reference the active view.
     */
    protected activeListViewChanged(): void
    {
        // If a list view is active, fetch the items to present.

        if (this.activeListView != null)
        {
            this.update(this.activeListView);
        }

        // Ensure the URL specifies the ID of the active list view, if any.

        // tslint:disable-next-line: no-floating-promises
        this._historyHelper.navigate((state: IHistoryState) =>
        {
            state.params.view = this.activeListView?.definition.id;
        },
        { trigger: false, replace: true });
    }

    /**
     * Updates the page by fetching the items to present in the list.
     * @param listView The list view to update.
     */
    protected update(listView: ListView<TListViewFilter, TListItem>): void
    {
        // Abort any existing operation.
        listView.operation?.abort();

        // Create and execute a new operation.
        listView.operation = new Operation(async signal =>
        {
            // Fetch the items.
            const result = await this.fetch(listView, signal);

            // Update the state of the list view.
            listView.items = result.items;
            listView.itemCount = result.itemCount;
            listView.fetchedDateTime = DateTime.utc();

            // Reset paging.
            listView.paging.page = 1;

            // Reset scroll.
            this.scroll?.reset();
        });
    }

    /**
     * Fetches the the items to present in the list.
     * Implementations must override this, to implement the actual fetching.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A model representing the items to present in the list.
     */
    protected abstract fetch(listView: ListView<TListViewFilter, TListItem>, signal: AbortSignal): Promise<IListViewPageItems>;
}
