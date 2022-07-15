import { DateTime } from "luxon";
import { autoinject, computedFrom, observable } from "aurelia-framework";
import { MapObject } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { LocalStateService } from "app/services/local-state";
import { RouteInfo } from "app/model/route";
import { ListViewService, ListViewDefinition, ListView, IListViewFilter, IListViewItem } from "app/model/list-view";

interface IRouteFilter extends IListViewFilter
{
}

/**
 * Represents the route parameters for the page.
 */
interface IListViewParams
{
    view?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class ListViewsPage<TListItem extends IListViewItem = RouteInfo, TListViewFilter extends IListViewFilter = IRouteFilter>
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

    protected readonly listViewType = "route";

    /**
     * The list view definitions.
     */
    protected listViewDefinitions:
    {
        personal: ListViewDefinition<TListViewFilter>[],
        shared: ListViewDefinition<TListViewFilter>[]
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
     */
    @computedFrom("activeListView.definition.columns")
    protected get tableStyle(): MapObject
    {
        return { "grid-template-columns": `${this.activeListView?.definition.columns.map(c => c.width).join(" ")} min-content` };
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public async activate(params: IListViewParams): Promise<void>
    {
        // Fetch the list view definitions.

        this.listViewDefinitions = await this._listViewService.getAll(this.listViewType)

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
    public deactivate(): void
    {
        // Abort any pending operation.
        this.activeListView?.operation?.abort();
    }

    /**
     * Gets the list view with the specified ID, if available.
     * @param listViewId The ID of the list view to get.
     * @returns The list view with the specified ID, or undefined if not available.
     */
    private getListViewDefinition(listViewId: string): ListViewDefinition<TListViewFilter> | undefined
    {
        const listView =
            this.listViewDefinitions.shared.find(listView => listView.id == listViewId) ??
            this.listViewDefinitions.personal.find(listView => listView.id == listViewId);

        return listView;
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
     * @param item The item that was clicked.
     */
    protected onItemClick(item: { id: string }): void
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
     * Updates the page by fetching the latest data.
     * @param listView The list view to update.
     */
    protected update(listView: ListView<TListViewFilter, TListItem>): void
    {
        listView.operation = new Operation(async signal =>
        {
            try
            {
                // Fetch the items.
                var result = await this.fetchItems(listView, signal);

                // Update the state of the list view.
                listView.items = result.items;
                listView.itemCount = result.itemCount;
                listView.fetchedDateTime = DateTime.utc();

                // Reset paging.
                listView.paging.page = 1;

                // Reset scroll.
                this.scroll?.reset();
            }
            catch (error)
            {
                Log.error("An error occurred while fetching the items.", error);
            }
        });
    }

    /**
     * Updates the page by fetching the latest data.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     */
    protected async fetchItems(listView: ListView<TListViewFilter, TListItem>, signal: AbortSignal): Promise<{ items: [], itemCount: 0 }>
    {
        return { items: [], itemCount: 0 };
    }
}
