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
export abstract class ListViewsPage<TListViewFilter extends IListViewFilter, TListItem>
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
     * The widths of the columns, or undefined if no view is active.
     * Implementations may override this if needed, e.g. to support selection.
     */
    @computedFrom("activeListView.definition.columns")
    protected get columnWidths(): string[] | undefined
    {
        return this.activeListView?.definition.columns
            .filter(column => column.visibility === "visible")
            .map(c => c.width);
    }

    /**
     * True if the icons column should be visible, otherwise false.
     */
    @computedFrom("activeListView.definition.columns")
    protected get showIconsColumn(): boolean
    {
        return this.activeListView?.definition.columns
            .some(column => column.visibility === "icon") ?? false;
    }

    /**
     * The style defining the grid template columns for the `data-table`.
     */
    @computedFrom("activeListView.definition.columns")
    protected get tableStyle(): MapObject
    {
        if (this.activeListView == null)
        {
            return {};
        }

        // Get the widths of the data columns.
        const columnWidths = this.columnWidths!;

        // Add the width of the `icons` column, if relevant.
        if (this.showIconsColumn)
        {
            columnWidths.push("min-content");
        }

        // Add the width of the drag handle column.
        columnWidths.push("min-content");

        return { "grid-template-columns": columnWidths.join(" ") };
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async activate(params: IListViewPageParams): Promise<void>
    {
        // Get the local state for list views of the relevant type.
        const localListViewState = this._localStateService.get().listView?.[this.listViewType];

        // Get the IDs of the open list views, if any.
        const openListViewIds = localListViewState?.open;

        // Get the ID of the active list view, if any.
        const activeListViewId = params.view || localListViewState?.active;

        // Fetch the list view definitions.
        this.listViewDefinitions = await this._listViewService.getAll(this.listViewType);

        // Create the open list views, if any.

        this.openListViews = [];

        if (openListViewIds != null)
        {
            for (const openListViewId of openListViewIds)
            {
                const listViewDefinition = this.getListViewDefinition(openListViewId);

                if (listViewDefinition != null)
                {
                    const listView = new ListView<TListViewFilter, TListItem>(listViewDefinition);
                    this.openListViews.push(listView);
                }
            }
        }

        // If the ID of an available list view was specified, ensure it is open and active.

        if (activeListViewId)
        {
            this.activeListView = this.openListViews.find(listView => listView.definition.id === activeListViewId);

            if (this.activeListView == null)
            {
                const listViewDefinition = this.getListViewDefinition(activeListViewId);

                if (listViewDefinition != null)
                {
                    var listView = new ListView<TListViewFilter, TListItem>(listViewDefinition);
                    this.openListViews.unshift(listView);
                    this.activeListView = listView;
                }
            }
        }

        // If the ID of an available list view was not specified, activate the first open view, if any.

        if (this.activeListView == null)
        {
            this.activeListView = this.openListViews[0];
        }
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the operation completes.
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
     * Updates the page by fetching the items to present.
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
     * Fetches the the items to present.
     * Implementations must override this, to implement the actual fetching.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A promise that will be resolved with a model representing the items to present.
     */
    protected abstract fetch(listView: ListView<TListViewFilter, TListItem>, signal: AbortSignal): Promise<IListViewPageItems>;
}
