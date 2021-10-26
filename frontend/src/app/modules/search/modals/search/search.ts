import { autoinject, computedFrom, observable } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal } from "shared/framework";
import { SearchService, SearchInfo } from "app/modules/search/services/search";
import { SavedSearchService } from "app/modules/search/services/saved-search";
import { RecentSearchService } from "app/modules/search/services/recent-search";
import { StarredItemService } from "app/modules/starred/services/starred-item";
import { EntityInfo } from "app/types/entity";

// The delay in milliseconds before a search is logged, after the query changes.
const logSearchDelay = 3000;

/**
 * Represents the global `search` modal panel.
 * This allows the user to search across all entities,
 * save searches, and see recent searches.
 */
@autoinject
export class SearchModalPanel
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param searchService The `SearchService` instance.
     * @param savedSearchService The `SavedService` instance.
     * @param recentSearchService The `RecentService` instance.
     * @param starredhService The `StarredItemService` instance.
     */
    public constructor(modal: Modal, searchService: SearchService, savedSearchService: SavedSearchService, recentSearchService: RecentSearchService, starredItemService: StarredItemService)
    {
        this._modal = modal;
        this._searchService = searchService;
        this._savedSearchService = savedSearchService;
        this._recentSearchService = recentSearchService;
        this._starredItemService = starredItemService;
    }

    private readonly _modal: Modal;
    private readonly _searchService: SearchService;
    private readonly _recentSearchService: RecentSearchService;
    private readonly _savedSearchService: SavedSearchService;
    private readonly _starredItemService: StarredItemService;
    private _activateOperation: Operation | undefined;
    private _logTimeoutHandle: any;

    /**
     * The query text, or undefined if no query has been entered.
     */
    @observable
    protected queryText: string | undefined;

    /**
     * The query text input element.
     */
    protected queryInputElement: HTMLElement;

    /**
     * The most recent search operation, if any.
     */
    protected operation: Operation | undefined;

    /**
     * True if the search can be saved, otherwise false.
     */
    @computedFrom("queryText", "savedItems.length")
    protected get canSave(): boolean
    {
        if (!this.queryText || this.recentItems == null || this.savedItems == null)
        {
            return false;
        }

        return !this.savedItems.some(i => i.text.toLowerCase() === this.queryText!.toLowerCase());
    }

    /**
     * The saved items for the current user.
     */
    protected savedItems: SearchInfo[] | undefined;

    /**
     * True to show more saved items, otherwise false.
     */
    protected showMoreSaved = false;

    /**
     * True if the saved section is expanded, otherwise false.
     */
    protected savedSectionExpanded = true;

    /**
     * The max number of saved items to show by default.
     */
    @computedFrom("recentSectionExpanded")
    protected get savedItemsLimit(): number
    {
        return this.recentSectionExpanded ? 5 : 7;
    }

    /**
     * The filtered list of saved items.
     */
    @computedFrom("savedItems.length", "queryText")
    protected get filteredSavedItems(): SearchInfo[]
    {
        if (this.savedItems == null)
        {
            return [];
        }

        const queryText = this.queryText ? this.queryText.toLowerCase() : "";

        return this.savedItems

            // Include only items that match the filter text, but ignore items
            // that are an exact match, as they would provide no additional value.
            .filter(item =>
            {
                const itemQueryText = item.text.toLowerCase();

                return itemQueryText.includes(queryText) && itemQueryText !== queryText;
            });
    }

    /**
     * The recent items for the current user.
     */
    protected recentItems: SearchInfo[] | undefined;

    /**
     * True to show more recent items, otherwise false.
     */
    protected showMoreRecent = false;

    /**
     * True if the recent section is expanded, otherwise false.
     */
    protected recentSectionExpanded = true;

    /**
     * The max number of recent items to show by default.
     */
    protected recentItemsLimit = 50;

    /**
     * The filtered list of recent items.
     */
    @computedFrom("recentItems.length", "queryText", "savedItems.length")
    protected get filteredRecentItems(): SearchInfo[]
    {
        if (this.recentItems == null)
        {
            return [];
        }

        const queryText = this.queryText ? this.queryText.toLowerCase() : "";

        return this.recentItems

            // Include only items that match the filter text, but ignore items
            // that are an exact match, as they would provide no additional value.
            .filter(item =>
            {
                const itemQueryText = item.text.toLowerCase();

                return itemQueryText.includes(queryText) && itemQueryText !== queryText;
            });
    }

    /**
     * The search results for the current query.
     */
    protected searchResults: EntityInfo[] | undefined;

    /**
     * True if the results section is expanded, otherwise false.
     */
    protected resultsSectionExpanded = true;

    /**
     * Called by the framework when the modal is activating.
     */
    public activate(): void
    {
        this._activateOperation = new Operation(async signal =>
        {
            // Get saved and recent items.

            const [savedItems, recentItems] = await Promise.all(
            [
                this._savedSearchService.getAll(signal),
                this._recentSearchService.getAll(signal)
            ]);

            this.savedItems = savedItems;

            this.recentItems = recentItems

                // Include only items not found in the saved list.
                // TODO:2: We should really compare by UUID here, but entities do not have that at this time.
                .filter(item =>
                    !item.text || !this.savedItems!.some(i => i.text === item.text));
        });

        this._activateOperation.promise
            .catch(error => Log.error(error));
    }

    /**
     * Called by the framework when the modal is deactivating.
     */
    public deactivate(): void
    {
        // Abort any pending activate operation.
        this._activateOperation?.abort();
    }

    /**
     * Called when the `queryText` property changes.
     * Gets the search results matching the query.
     */
    protected queryTextChanged(): void
    {
        clearTimeout(this._logTimeoutHandle);
        this._logTimeoutHandle = undefined;

        if (this.queryText)
        {
            // Schedule the search to be logged.
            this._logTimeoutHandle = setTimeout(() => this.ensureSearchIsLogged(), logSearchDelay);
        }

        if (this.operation != null)
        {
            this.operation.abort();
        }

        if (this.queryText)
        {
            this.operation = new Operation(async signal =>
            {
                this.searchResults = await this._searchService.search(this.queryText!, signal);
            });
        }
        else
        {
            this.searchResults = [];
        }
    }

    /**
     * Called when the `save` icon is clicked.
     * Adds the current search to the collection of saved searches.
     * @param event The mouse event.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async saveClick(): Promise<void>
    {
        const queryText = this.queryText!;

        // If needed, log the search as a recent search.
        this.ensureSearchIsLogged();

        // Save the item.
        const search = await this._savedSearchService.add(queryText);

        // Remove the existing item from the recent collection, if found there.

        const indexInRecent = this.recentItems!.findIndex(i => i.text === queryText);

        if (indexInRecent > -1)
        {
            this.savedItems!.splice(indexInRecent, 1);
        }

        // Remove the existing item from the saved collection, if found there.

        const indexInSaved = this.savedItems!.findIndex(i => i.text === queryText);

        if (indexInSaved > -1)
        {
            this.savedItems!.splice(indexInSaved, 1);
        }

        // Add the item to the top of the saved collection.
        this.savedItems!.unshift(search);
    }

    /**
     * Called when a saved or recent search is clicked.
     * Executes the query represented by the search.
     * @param event The mouse event.
     * @param item The item being clicked.
     * @param isSavedSearch True id the search is saved, otherwise false.
     */
    protected searchClick(event: MouseEvent, item: SearchInfo, isSavedSearch: boolean): void
    {
        if (event.defaultPrevented)
        {
            return;
        }

        // Set, and thereby execute, the query represented by the search.
        this.queryText = item.text;

        // Remove the existing item from the recent collection, if found there.
        if (!isSavedSearch)
        {
            const indexInRecent = this.recentItems!.findIndex(i => i.text === item.text);

            if (indexInRecent > -1)
            {
                this.recentItems!.splice(indexInRecent, 1);
            }

            // Add the item to the top of the recent collection.
            this.recentItems!.unshift(item);
        }

        this.queryInputElement.focus();
    }

    /**
     * Called when the `delete` icon is clicked on a saved item.
     * Removes the item from the collection of saved items.
     * @param item The item being deleted.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async deleteClick(item: SearchInfo): Promise<void>
    {
        // If needed, log the search as a recent search.
        this.ensureSearchIsLogged();

        // Unstar the item.
        await this._savedSearchService.delete(item.id);

        // Remove the item from the saved collection.
        this.savedItems!.splice(this.savedItems!.indexOf(item), 1);
    }

    /**
     * Called when the `star` icon is clicked on a search result.
     * Toggles the starred state of the result.
     * @param result The result being starred or unstarred.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async starClick(result: EntityInfo): Promise<void>
    {
        // If needed, log the search as a recent search.
        this.ensureSearchIsLogged();

        if (result.starred)
        {
            // Unstar the result.
            await this._starredItemService.remove(result.starId!);

            // Mark the result as unstarred.
            result.starred = false;
        }
        else
        {
            // Star the result.
            await this._starredItemService.add(result.starId!);

            // Mark the result as starred.
            result.starred = true;
        }
    }

    /**
     * Called when a search result is clicked.
     * Closes the modal and ensures the search is added as a recent search.
     * @param event The mouse event.
     * @returns True to continue.
     */
    protected resultClick(event: MouseEvent): boolean
    {
        if (event.defaultPrevented)
        {
            return false;
        }

        // If needed, log the search as a recent search.
        this.ensureSearchIsLogged();

        // Make sure the modal closes, even if no navigation is triggered.
        // tslint:disable-next-line: no-floating-promises
        this._modal.close();

        return true;
    }

    /**
     * Ensures the current search, if any, is logged as a recent search.
     */
    private ensureSearchIsLogged(): void
    {
        if (this._logTimeoutHandle != null)
        {
            clearTimeout(this._logTimeoutHandle);
            this._logTimeoutHandle = undefined;

            if (this.queryText)
            {
                // Log the search as a recent search.
                this._recentSearchService.add(this.queryText)
                    .catch(e => console.error("Failed to add search to recent searches", e));
            }
        }
    }
}
