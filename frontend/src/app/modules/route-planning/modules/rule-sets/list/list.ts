import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { IScroll, ModalService } from "shared/framework";
import { RoutePlanningSettingsService, RoutePlanningSettingsInfo } from "app/model/_route-planning-settings";
import { Log } from "shared/infrastructure";
import { DeleteRoutePlanRuleDialog } from "./modals/confirm-delete/confirm-delete";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param routePlanningSettingsService The `RoutePlanningSettingsService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(routePlanningSettingsService: RoutePlanningSettingsService, modalService: ModalService)
    {
        this._routePlanningSettingsService = routePlanningSettingsService;
        this._modalService = modalService;
    }

    private readonly _modalService: ModalService;
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
     * @param rule The route planning settings to delete.
     */
    protected async onDeleteSettingsClick(rule: RoutePlanningSettingsInfo): Promise<void>
    {
        const confirmed = await this._modalService.open(DeleteRoutePlanRuleDialog, rule).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._routePlanningSettingsService.delete(rule.id);

            this.items.splice(this.items.indexOf(rule), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the route planning settings", error);
        }
    }
}
