import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { ChangeDetector, IValidation } from "shared/framework";
import { AutoContractorAssignmentService, AutoContractorAssignmentSettings } from "app/model/auto-contractor-assignment";

/**
 * Represents the page.
 */
@autoinject
export class AutoContractorAssignmentModule
{
    /**
     * Creates a new instance of the class.
     * @param autoContractorAssignmentService The `AutoContractorAssignmentService` instance.
     */
    public constructor(autoContractorAssignmentService: AutoContractorAssignmentService)
    {
        this._autoContractorAssignmentService = autoContractorAssignmentService;
    }

    private readonly _autoContractorAssignmentService: AutoContractorAssignmentService;
    private _changeDetector: ChangeDetector;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The auto contractor assignment settings.
     */
    protected settings: AutoContractorAssignmentSettings;

    /**
     * True if the auto contractor assignment settings are being updated, otherwise false.
     */
    protected updating: boolean = false;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(): Promise<void>
    {
        this.settings = await this._autoContractorAssignmentService.get();

        this._changeDetector = new ChangeDetector(() => this.settings);
    }

    /**
     * Called by the framework before the module is deactivated.
     * @returns A promise that will be resolved with true if the module should be deactivated, otherwise false.
     */
    public async canDeactivate(): Promise<boolean>
    {
        return this._changeDetector?.allowDiscard();
    }

    /**
     * Called when the "Save changes" button is clicked.
     * Saves the route planning settings.
     */
    protected async onSaveClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        this.updating = true;

        try
        {
            await this._autoContractorAssignmentService.update(this.settings);

            this._changeDetector.markAsUnchanged();

            this.updating = false;
        }
        catch (error)
        {
            this.updating = false;
            Log.error("Could not save the auto contractor assignment settings", error);
        }
    }
}
