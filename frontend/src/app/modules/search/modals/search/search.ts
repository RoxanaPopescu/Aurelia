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
    @computedFrom("queryText", "savedSearches.length", "recentSearches.length")
    protected get canSave(): boolean
    {
        if (!this.queryText || this.savedSearches == null || this.recentSearches == null)
        {
            return false;
        }

        return !this.savedSearches.some(savedSearch => savedSearch.text.toLowerCase() === this.queryText!.toLowerCase());
    }

    /**
     * The saved searches for the current user.
     */
    protected savedSearches: SearchInfo[] | undefined;

    /**
     * True if the saved section is expanded, otherwise false.
     */
    protected savedSectionExpanded = true;

    /**
     * True to show more saved searches, otherwise false.
     */
    protected showMoreSavedSearches = false;

    /**
     * The max number of saved searches to show by default.
     */
    @computedFrom("queryText", "recentSectionExpanded")
    protected get savedSearchesLimit(): number
    {
        return this.queryText ? 2 : this.recentSectionExpanded ? 5 : 7;
    }

    /**
     * The filtered collection of saved searches.
     */
    @computedFrom("queryText", "savedSearches.length")
    protected get filteredSavedSearches(): SearchInfo[]
    {
        if (this.savedSearches == null)
        {
            return [];
        }

        const queryText = this.queryText ? this.queryText.toLowerCase() : "";

        return this.savedSearches

            // Include only searches that match the filter text, but ignore searches
            // that are an exact match, as they would provide no additional value.
            .filter(search =>
            {
                const searchQueryText = search.text.toLowerCase();

                return searchQueryText.includes(queryText) && searchQueryText !== queryText;
            });
    }

    /**
     * The recent searches for the current user.
     */
    protected recentSearches: SearchInfo[] | undefined;

    /**
     * True if the recent section is expanded, otherwise false.
     */
    protected recentSectionExpanded = true;

    /**
     * True to show more recent searches, otherwise false.
     */
    protected showMoreRecentSearches = false;

    /**
     * The max number of recent searches to show by default.
     */
    @computedFrom("queryText")
    protected get recentSearchesLimit(): number
    {
        return this.queryText ? 2 : 50;
    }

    /**
     * The filtered collection of recent searches.
     */
    @computedFrom("queryText", "savedSearches.length", "recentSearches.length")
    protected get filteredRecentSearches(): SearchInfo[]
    {
        if (this.savedSearches == null || this.recentSearches == null)
        {
            return [];
        }

        const queryText = this.queryText ? this.queryText.toLowerCase() : "";

        return this.recentSearches

            // Include only searches that match the filter text, but ignore searches
            // that are an exact match, as they would provide no additional value.
            // Also ignore searches found in the saved collection.
            .filter(search =>
            {
                const searchQueryText = search.text.toLowerCase();

                return searchQueryText.includes(queryText) && searchQueryText !== queryText &&
                    !this.savedSearches!.some(savedSearch => savedSearch.text === search.text);
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
            // Get saved and recent searches.

            [this.savedSearches, this.recentSearches] = await Promise.all(
            [
                this._savedSearchService.getAll(signal),
                this._recentSearchService.getAll(signal)
            ]);
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
        // Abort any scheduled logging.
        clearTimeout(this._logTimeoutHandle);

        // Clear the timeout handle to indicate that no logging is scheduled.
        this._logTimeoutHandle = undefined;

        if (this.queryText)
        {
            // Schedule the search to be logged after a short delay.
            this._logTimeoutHandle = setTimeout(() => this.ensureLoggedAsRecent(), logSearchDelay);
        }

        // Abort any pending query operration.
        this.operation?.abort();

        if (this.queryText)
        {
            // Start a new query operation.
            this.operation = new Operation(async signal =>
            {
                this.searchResults = await this._searchService.search(this.queryText!, signal);
            });
        }
        else
        {
            // Clear the results.
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
        // Ensure the search is logged as a recent search.
        this.ensureLoggedAsRecent();

        // Save the search.
        const search = await this._savedSearchService.add(this.queryText!);

        // Add the search to the top of the saved collection.
        this.savedSearches!.unshift(search);
    }

    /**
     * Called when a saved or recent search is clicked.
     * Executes the query represented by the search.
     * @param event The mouse event.
     * @param search The search being clicked.
     * @param isSavedSearch True id the search is saved, otherwise false.
     */
    protected searchClick(event: MouseEvent, search: SearchInfo, isSavedSearch: boolean): void
    {
        if (event.defaultPrevented)
        {
            return;
        }

        // Set, and thereby execute, the query represented by the search.
        this.queryText = search.text;

        // Focus the search input, in case the user wants to refine the query.
        this.queryInputElement.focus();
    }

    /**
     * Called when the `delete` icon is clicked on a saved search.
     * Removes the search from the collection of saved searches.
     * @param search The search being deleted.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async deleteClick(search: SearchInfo): Promise<void>
    {
        // Ensure the search is logged as a recent search.
        this.ensureLoggedAsRecent();

        // Delete the search.
        await this._savedSearchService.delete(search.id);

        // Remove the search from the saved collection.
        this.savedSearches!.splice(this.savedSearches!.indexOf(search), 1);
    }

    /**
     * Called when the `star` icon is clicked on a search result.
     * Toggles the starred state of the entity represented by the result.
     * @param result The entity being starred or unstarred.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async starClick(result: EntityInfo): Promise<void>
    {
        // Ensure the search is logged as a recent search.
        this.ensureLoggedAsRecent();

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
     * Closes the modal and navigates to the URL associated with the result.
     * @param event The mouse event.
     * @returns True to continue.
     */
    protected resultClick(event: MouseEvent): boolean
    {
        if (event.defaultPrevented)
        {
            return false;
        }

        // Ensure the search is logged as a recent search.
        this.ensureLoggedAsRecent();

        // Make sure the modal closes, even if no navigation is triggered.
        // tslint:disable-next-line: no-floating-promises
        this._modal.close();

        return true;
    }

    /**
     * Ensures the current search, if any, is logged as a recent search.
     */
    private ensureLoggedAsRecent(): void
    {
        // Only log the search, if logging is already scheduled.
        if (this._logTimeoutHandle != null)
        {
            // Abort the scheduled logging.
            clearTimeout(this._logTimeoutHandle);

            // Clear the timeout handle to indicate that no logging is scheduled.
            this._logTimeoutHandle = undefined;

            // Capture the query text.
            const queryTextToLog = this.queryText;

            // Only log the search, if a query text is specified.
            if (queryTextToLog)
            {
                // Log the search as a recent search.
                this._recentSearchService.add(queryTextToLog)

                    .then(recentSearch =>
                    {
                        // Add or move the search to the top of the recent collection.

                        const indexInRecent = this.recentSearches!.findIndex(s => s.text.toLowerCase() === queryTextToLog.toLowerCase());

                        if (indexInRecent > -1)
                        {
                            this.recentSearches!.splice(indexInRecent, 1);
                        }

                        this.recentSearches!.unshift(recentSearch);
                    })

                    .catch(error => console.error("Failed to add search to recent searches", error));
            }
        }
    }
}
