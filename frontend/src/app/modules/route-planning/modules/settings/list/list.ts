import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { IScroll } from "shared/framework";
import { RoutePlanningSettingsService, RoutePlanningSettingsInfo } from "app/model/_route-planning-settings";
import { Log } from "shared/infrastructure";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param routePlanningSettingsService The `RoutePlanningSettingsService` instance.
     */
    public constructor(routePlanningSettingsService: RoutePlanningSettingsService)
    {
        this._routePlanningSettingsService = routePlanningSettingsService;
    }

    private readonly _routePlanningSettingsService: RoutePlanningSettingsService;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The items to present in the table.
     */
    protected items: RoutePlanningSettingsInfo[];

    /**
     * Called by the framework when the module is activated.
     */
    public activate(): void
    {
        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            // Fetch the data.
            this.items = await this._routePlanningSettingsService.getAll(signal);
        });
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
     * Called when the "Delete" button is clicked on a route planning settings item.
     * Deletes the route planning settings.
     * @param settings The route planning settings to delete.
     */
    protected async onDeleteSettingsClick(settings: RoutePlanningSettingsInfo): Promise<void>
    {
        try
        {
            await this._routePlanningSettingsService.delete(settings.id);

            this.items.splice(this.items.indexOf(settings), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the route planning settings", error);
        }
    }
}
