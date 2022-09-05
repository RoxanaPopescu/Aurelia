import { DateTime } from "luxon";
import { autoinject, computedFrom, observable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { AbortError, MapObject, Type } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { LocalStateService } from "app/services/local-state";
import { ListViewService, ListViewDefinition, ListView, ListViewFilter, ListViewType, ListViewColumn } from "app/model/list-view";
import { SelectColumnsPanel } from "app/modals/panels/select-columns/select-columns";
import { EditListViewDialog } from "./modals/edit-list-view/edit-list-view";
import { ConfirmDeleteListViewDialog } from "./modals/confirm-delete-list-view/confirm-delete-list-view";

/**
 * Represents the route parameters for the page.
 */
export interface IListViewPageParams
{
    /**
     * The ID of the list view to open and activate.
     */
    view?: string;

    /**
     * The page number to present in active list view.
     */
    page?: string;
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
export abstract class ListViewsPage<TListViewFilter extends ListViewFilter, TListItem>
{
    /**
     * Creates a new instance of the type.
     * @param router The `Router` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     * @param localStateService The `LocalStateService` instance.
     * @param listViewService The `ListViewService` instance.
     */
    public constructor(router: Router, historyHelper: HistoryHelper, modalService: ModalService, localStateService: LocalStateService, listViewService: ListViewService)
    {
        this._router = router;
        this._historyHelper = historyHelper;
        this._modalService = modalService;
        this._localStateService = localStateService;
        this._listViewService = listViewService;
    }

    protected readonly _router: Router;
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
     * The type of list views presented by the page.
     * Implementations must override this, to specify the actual type.
     */
    protected abstract readonly listViewColumnType: Type<ListViewColumn>;

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

        return { "--data-table-columns": columnWidths.join(" ") };
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async activate(params: IListViewPageParams): Promise<void>
    {
        // Get the session state for list views of the relevant type.
        const sessionListViewState =
            this._localStateService.get("session").listView?.[this.listViewType];

        // Get the local state for list views of the relevant type.
        const localListViewState =
            this._localStateService.get("local").listView?.[this.listViewType];

        // Get the IDs of the open list views, if any.
        const openListViewIds = sessionListViewState?.open ?? localListViewState?.open;

        // Get the ID of the active list view, if any.
        const activeListViewId = params.view || sessionListViewState?.active || localListViewState?.active;

        // Get the page of the active list view, if any.
        const activeListViewPage = parseInt(params.page ?? "1");

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

                    this.observeListView(listView);
                }
            }
        }

        // If no list view has ever been opened, attempt to create the default list view.

        if (this.openListViews.length === 0 && sessionListViewState == null && localListViewState == null)
        {
            const listViewDefinition = await this.createDefaultListView();

            if (listViewDefinition != null)
            {
                this.listViewDefinitions.personal.push(listViewDefinition);

                const listView = new ListView<TListViewFilter, TListItem>(listViewDefinition);

                this.openListViews.push(listView);

                this.observeListView(listView);
            }
        }

        // If the ID of an available list view was specified, ensure it is open and active.

        if (activeListViewId)
        {
            // tslint:disable-next-line: no-shadowed-variable
            let listView = this.openListViews.find(listView => listView.definition.id === activeListViewId);

            if (listView != null)
            {
                listView.paging.page = activeListViewPage;

                this.activeListView = listView;
            }
            else
            {
                const listViewDefinition = this.getListViewDefinition(activeListViewId);

                if (listViewDefinition != null)
                {
                    listView = new ListView<TListViewFilter, TListItem>(listViewDefinition);

                    listView.paging.page = activeListViewPage;

                    this.openListViews.unshift(listView);
                    this.activeListView = listView;

                    this.observeListView(listView);
                }
            }
        }

        // If the ID of an available list view was not specified, activate the first open view, if any.

        if (this.activeListView == null)
        {
            const listView = this.openListViews[0];

            if (listView != null)
            {
                listView.paging.page = activeListViewPage;

                this.activeListView = listView;
            }
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
     * Called when a list view definition was clicked in the list view selector, and should be opened.
     * @param listViewDefinition The list view definition for which a list view should be opened.
     */
    protected onOpenListView(listViewDefinition: ListViewDefinition<TListViewFilter>): void
    {
        let listView = this.openListViews.find(lv => lv.definition === listViewDefinition);

        if (listView != null)
        {
            if (listView !== this.activeListView)
            {
                this.activeListView = listView;

                // Ensure the local state is updated.
                this.updateLocalState();
            }
        }
        else
        {
            listView = new ListView<TListViewFilter, TListItem>(listViewDefinition);

            this.openListViews.push(listView);
            this.activeListView = listView;

            // Ensure the local state is updated.
            this.updateLocalState();

            this.observeListView(listView);
        }
    }

    /**
     * Called when the `Close view` icon on a list view tab is clicked, or when a list view definition is deleted.
     * Closes the specified list view, reverts any unsaved changes, and activates the first of the remaining open list views.
     * @param listViewDefinition The list view definition for which the list view should be closed.
     */
    protected onCloseListView(listViewDefinition: ListViewDefinition<TListViewFilter>): void
    {
        const listView = this.openListViews.find(lv => lv.definition === listViewDefinition);

        if (listView != null)
        {
            const listViewIndex = this.openListViews.indexOf(listView);

            this.openListViews.splice(listViewIndex, 1);

            if (this.activeListView === listView)
            {
                this.activeListView = this.openListViews[listViewIndex - 1] ?? this.openListViews[0];
            }

            if (listView.hasChanges)
            {
                this.revertListViewChanges(listView);
            }

            // Ensure the local state is updated.
            this.updateLocalState();
        }
    }

    /**
     * Called by the framework when the `activeListView` property changes.
     * Updates the URL to reference the active view.
     */
    protected activeListViewChanged(): void
    {
        // Set the title associated with the route config.
        this._router.title = this.activeListView?.definition.name;
        this._router.updateTitle();

        // If a list view is active, fetch the items to present.

        if (this.activeListView != null && this.activeListView.items == null)
        {
            this.update(this.activeListView, "paging");
        }

        // Ensure the URL specifies the ID of the active list view, if any.

        // tslint:disable-next-line: no-floating-promises
        this._historyHelper.navigate((state: IHistoryState) =>
        {
            state.params.view = this.activeListView?.definition.id;
            state.params.page = this.activeListView?.paging.page;
        },
        { trigger: false, replace: true });

        // Ensure the local state is updated.
        this.updateLocalState();
    }

    /**
     * Updates the open list views and active list view stored in local state.
     */
    protected updateLocalState(): void
    {
        this._localStateService.mutate(data =>
        {
            if (data.listView == null)
            {
                data.listView = {} as any;
            }

            if (data.listView[this.listViewType] == null)
            {
                data.listView[this.listViewType] = {} as any;
            }

            // Get the session state for list views of the relevant type.
            const sessionListViewState = data.listView[this.listViewType];

            // Set the IDs of the open list views, if any.
            sessionListViewState.open = this.openListViews.map(listView => listView.definition.id);

            // Set the ID of the active list view, if any.
            sessionListViewState.active = this.activeListView?.definition.id;
        },
        "session");

        this._localStateService.mutate(data =>
        {
            if (data.listView == null)
            {
                data.listView = {} as any;
            }

            if (data.listView[this.listViewType] == null)
            {
                data.listView[this.listViewType] = {} as any;
            }

            // Get the local state for list views of the relevant type.
            const localListViewState = data.listView[this.listViewType];

            // Set the IDs of the open list views, if any.
            localListViewState.open = this.openListViews.map(listView => listView.definition.id);

            // Set the ID of the active list view, if any.
            localListViewState.active = this.activeListView?.definition.id;
        },
        "local");
    }

    /**
     * Called when the `Save view changes` button is clicked.
     * Saves the changes to the active list view definition.
     * @returns A promise that will be resolved when the operation completes.
     */
    protected async onSaveListViewChangesClick(): Promise<void>
    {
        const listView = this.activeListView!;

        try
        {
            listView.definition = await this._listViewService.update(listView.definition);
            listView.hasChanges = false;

            this.observeListView(listView);
        }
        catch (error)
        {
            Log.error("Could not save the view changes", error);
        }
    }

    /**
     * Called when the `Revert view changes` button is clicked.
     * Reverts the changes to the active list view definition.
     */
    protected onRevertListViewChangesClick(): void
    {
        const listView = this.activeListView!;

        this.revertListViewChanges(listView);
    }

    /**
     * Called when the `Edit view` button is clicked.
     * Opens the modal for editing the list view.
     * @returns A promise that will be resolved when the operation completes.
     */
    protected async onEditListViewClick(): Promise<void>
    {
        const listView = this.activeListView!;

        await this._modalService.open(EditListViewDialog,
        {
            listViewDefinition: listView.definition,
            listViewDefinitions: this.listViewDefinitions
        })
        .promise;
    }

    /**
     * Called when the `Delete view` button is clicked.
     * Asks the user to confirm, then deletes the active list view definition.
     * @returns A promise that will be resolved when the operation completes.
     */
    protected async onDeleteListViewClick(): Promise<void>
    {
        const listViewDefinition = this.activeListView!.definition;

        const result = await this._modalService.open(ConfirmDeleteListViewDialog, listViewDefinition).promise;

        if (!result)
        {
            return;
        }

        await this._listViewService.delete(listViewDefinition);

        if (listViewDefinition.shared)
        {
            this.listViewDefinitions.shared.splice(this.listViewDefinitions.shared.indexOf(listViewDefinition), 1);
        }
        else
        {
            this.listViewDefinitions.personal.splice(this.listViewDefinitions.personal.indexOf(listViewDefinition), 1);
        }

        this.onCloseListView(listViewDefinition);
    }

    /**
     * Called when the `Edit view columns` button is clicked.
     * Opens the modal for editing the list view columns.
     */
    protected async onEditListViewColumnsClick(): Promise<void>
    {
        const listView = this.activeListView!;
        const columnType = this.listViewColumnType as any;

        const model =
        {
            availableColumns: Object.keys(columnType.values).filter(slug => slug !== "unknown").map(slug => new columnType(slug as any)),
            selectedColumns: listView.definition.columns
        };

        const result = await this._modalService.open(SelectColumnsPanel, model).promise;

        if (result != null)
        {
            listView.definition.columns = result;

            // HACK: Force a re-rendering of the entire view, to prevent a bug in Aurelia's `repeat.for` behavior.

            this.activeListView = undefined;

            setTimeout(() =>
            {
                this.activeListView = listView;

                this.update(listView, "paging");
            });
        }
    }

    /**
     * Called when the page is activated, and no list view has ever been opened.
     * Derived classes may override this to create a default list view definition.
     * @returns The default list view definition to open, or undefined to not open any view.
     */
    protected async createDefaultListView(): Promise<ListViewDefinition<TListViewFilter> | undefined>
    {
        return undefined;
    }

    /**
     * Reverts the changes made to the specified list view.
     * @param listView The list view forwhich to revert changes.
     */
    protected revertListViewChanges(listView: ListView<TListViewFilter, TListItem>): void
    {
        const listViewDefinitions = listView.definition.shared
            ? this.listViewDefinitions.shared
            : this.listViewDefinitions.personal;

        const index =  listViewDefinitions.indexOf(listView.definition);

        listView.revertChanges();

        listViewDefinitions.splice(index, 1, listView.definition);
    }

    /**
     * Updates the page by fetching the items to present.
     * @param listView The list view to update.
     * @param propertyPath The property path identifying the property in the list view that changed, if any.
     */
    protected update(listView: ListView<TListViewFilter, TListItem>, propertyPath?: string): void
    {
        if (listView.operation?.pending)
        {
            // Abort the pending operation.
            listView.operation.abort();
        }
        else
        {
            // Capture the current state, so it can be restored if the update fails.
            listView.temp =
            {
                fetchedDateTime: listView.fetchedDateTime,
                paging: listView.paging
            };
        }

        // If any filter was changed, reset the paging.
        if (propertyPath !== "paging")
        {
            listView.paging = { ...listView.paging, page: 1 };

            // Return, as setting the paging triggers a new update.
            return;
        }

        // Create and execute a new operation.
        listView.operation = new Operation(async signal =>
        {
            try
            {
                // Capture the start time of the request, as it could take a long time to complete.
                const fetchStartTime = DateTime.utc();

                // Clear the fetched time while updating.
                listView.fetchedDateTime = undefined;

                // tslint:disable-next-line: no-floating-promises
                this._historyHelper.navigate((state: IHistoryState) =>
                {
                    state.params.page = listView.paging.page;
                },
                { trigger: false, replace: true });

                // Fetch the items.
                const result = await this.fetch(listView, signal);

                // Update the items and item count.
                listView.items = result.items;
                listView.itemCount = result.itemCount;

                // Update the fetched time.
                listView.fetchedDateTime = fetchStartTime;

                // Clear the captured state.
                listView.temp = undefined;
            }
            catch (error)
            {
                if (!(error instanceof AbortError))
                {
                    // Restore the captured fetched time.
                    listView.fetchedDateTime = listView.temp.fetchedDateTime;

                    // Restore the captured paging.
                    listView.paging = listView.temp.paging;

                    // Clear the captured state.
                    listView.temp = undefined;

                    // tslint:disable-next-line: no-floating-promises
                    this._historyHelper.navigate((state: IHistoryState) =>
                    {
                        state.params.page = listView.temp.paging.page;
                    },
                    { trigger: false, replace: true });
                }

                throw error;
            }

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

    /**
     * Attaches this view model as the observer for the specified list view,
     * ensuring the `update` method will be called when changes occur.
     * @param listView The list view to observe.
     */
    private observeListView(listView: ListView<TListViewFilter, TListItem>): void
    {
        listView.update = (newValue: any, oldValue: any, propertyName: string) => this.update(listView, propertyName);
    }
}
