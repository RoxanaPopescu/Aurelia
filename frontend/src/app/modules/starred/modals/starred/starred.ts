import { autoinject, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { EntityInfo } from "app/types/entity";
import { StarredItemService } from "../../services/starred-item";
import { RecentItemService } from "../../services/recent-item";

/**
 * Represents the global `starred` modal panel.
 * This allows the user to see, and remove, starred items.
 * Additionally, it shows items the user has recently touched.
 */
@autoinject
export class StarredModalPanel
{
    /**
     * Creates a new instance of the type.
     * @param starredItemService The `StarredItemService` instance.
     * @param recentItemService The `RecentItemService` instance.
     */
    public constructor(starredItemService: StarredItemService, recentItemService: RecentItemService)
    {
        this._starredItemService = starredItemService;
        this._recentItemService = recentItemService;
    }

    private readonly _starredItemService: StarredItemService;
    private readonly _recentItemService: RecentItemService;
    private _activateOperation: Operation | undefined;

    /**
     * The text by which the items should be filtered.
     */
    protected textFilter: string | undefined;

    /**
     * The starred items for the current user.
     */
    protected starredItems: EntityInfo[];

    /**
     * True to show more starred items, otherwise false.
     */
    protected showMoreStarred = false;

    /**
     * True if the starred section is expanded, otherwise false.
     */
    protected starredSectionExpanded = true;

    /**
     * The max number of starred items to show by default.
     */
    @computedFrom("recentSectionExpanded")
    protected get starredItemsLimit(): number
    {
        return this.recentSectionExpanded ? 5 : 7;
    }

    /**
     * The filtered list of starred items.
     */
    @computedFrom("starredItems.length", "textFilter")
    protected get filteredStarredItems(): EntityInfo[]
    {
        const textFilter = this.textFilter ? this.textFilter.toLowerCase() : "";

        return this.starredItems

            // Include only items that match the filter text.
            .filter(item =>
                (!textFilter || item.name?.toLowerCase().includes(textFilter) || item.type.name.toLowerCase().includes(textFilter)));
    }

    /**
     * The recent items for the current user.
     */
    protected recentItems: EntityInfo[];

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
    @computedFrom("recentItems.length", "textFilter", "starredItems.length")
    protected get filteredRecentItems(): EntityInfo[]
    {
        const textFilter = this.textFilter ? this.textFilter.toLowerCase() : "";

        return this.recentItems

            // Include only items that match the filter text.
            // Also ignore searches found in the saved collection.
            .filter(item =>
                !item.starred &&
                (!textFilter || item.name?.toLowerCase().includes(textFilter) || item.type.name.toLowerCase().includes(textFilter)));
    }

    /**
     * Called by the framework when the modal is activating.
     */
    public activate(): void
    {
        this._activateOperation = new Operation(async signal =>
        {
            // Get starred and recent items.

            [this.starredItems, this.recentItems] = await Promise.all(
            [
                this._starredItemService.getAll(signal),
                this._recentItemService.getAll(signal)
            ]);
        });

        this._activateOperation.promise
            .catch(error => Log.error(error));
    }

    /**
     * Called by the framework when the page is deactivating.
     */
    public deactivate(): void
    {
        // Abort any pending activate operation.
        this._activateOperation?.abort();
    }

    /**
     * Called when the `Unstar` icon is clicked on an item.
     * Toggles the starred state of the item.
     * @param item The item being starred or unstarred.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async starClick(item: EntityInfo | EntityInfo): Promise<void>
    {
        if (item.starred)
        {
            // Unstar the item.
            await this._starredItemService.remove(item);

            // Update the starred state of the item in the recent collection, if found there.
            // NOTE: For change detection to work, this must be done before the starred collection is mutated.
            const recentItem = this.recentItems.find(i => i.starId === item.starId);

            if (recentItem != null)
            {
                recentItem.starred = false;
            }

            // Remove the item from the starred collection.
            this.starredItems.splice(this.starredItems.indexOf(item), 1);
        }
        else
        {
            // Star the item.
            await this._starredItemService.add(item);

            // Remove the existing item from the starred collection, if found there.

            const indexInStarred = this.starredItems.findIndex(i => i.starId === item.starId);

            if (indexInStarred > -1)
            {
                this.starredItems.splice(indexInStarred, 1);
            }

            // Add the item to the top of the starred collection.
            this.starredItems.unshift(item);
        }
    }
}
