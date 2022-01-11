import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { ModalService } from "shared/framework";
import { Log } from "shared/infrastructure";
import { DeleteAutomaticDispatchSettingsDialog } from "./modals/confirm-delete/confirm-delete";
import { AutomaticDispatchSettings, AutomaticDispatchSettingsService } from "app/model/automatic-dispatch";

/**
 * Represents the page.
 */
@autoinject
export class AutomaticDispatchSettingsListPage
{
    /**
     * Creates a new instance of the class.
     * @param automaticDispatchSettingsService The `AutomaticDispatchSettingsService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(automaticDispatchSettingsService: AutomaticDispatchSettingsService, modalService: ModalService)
    {
        this._automaticDispatchSettingsService = automaticDispatchSettingsService;
        this._modalService = modalService;
    }

    private readonly _modalService: ModalService;
    private readonly _automaticDispatchSettingsService: AutomaticDispatchSettingsService;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The items to present in the table.
     */
    protected items: AutomaticDispatchSettings[];

    /**
     * Called by the framework when the module is activated.
     */
    public activate(): void
    {
        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            // Fetch the data.
            this.items = await this._automaticDispatchSettingsService.getAll(signal);
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
     * Called when the "Delete" button is clicked on an automatic dispatch rule set.
     * Deletes the automatic dispatch rule set.
     * @param ruleSet The automatic dispatch rule set to delete.
     */
    protected async onDeleteSettingsClick(ruleSet: AutomaticDispatchSettings): Promise<void>
    {
        const confirmed = await this._modalService.open(DeleteAutomaticDispatchSettingsDialog, ruleSet).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._automaticDispatchSettingsService.delete(ruleSet.id);

            this.items.splice(this.items.indexOf(ruleSet), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the automatic dispatch rule set", error);
        }
    }
}
