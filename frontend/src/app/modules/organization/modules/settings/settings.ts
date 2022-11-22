import { autoinject } from "aurelia-framework";
import { AbortError } from "shared/types";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { ChangeDetector, IValidation } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationSettings } from "app/model/organization";

/**
 * Represents the page.
 */
@autoinject
export class SettingsPage
{
    /**
     * Creates a new instance of the class.
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(identityService: IdentityService, organizationService: OrganizationService)
    {
        this.readonly = !identityService.identity!.claims.has("edit-organizations");

        this._organizationService = organizationService;
    }

    private readonly _organizationService: OrganizationService;
    private _changeDetector: ChangeDetector;

    /**
     * The most recent operation.
     */
    protected operation: Operation;

    /**
     * The slug identifying the current tab.
     */
    protected tab: "profile" | "tracking" = "profile";

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The settings for the organization.
     */
    protected settings: OrganizationSettings | undefined;

    /**
     * True if the settings are readonly, otherwise false.
     */
    protected readonly: boolean;

    /**
     * Called by the framework when the module is activated.
     */
    public activate(): void
    {
        this.fetch();
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
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        this.operation?.abort();
    }

    /**
     * Fetches the latest data.
     */
    protected fetch(): void
    {
        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this.settings = await this._organizationService.getSettings(signal);

            this._changeDetector = new ChangeDetector(() => this.settings);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the organization settings", error);
            }
        });
    }

    /**
     * Called when the `Save changes` button is clicked.
     * Saves the changes made to the settings.
     */
    protected async onSaveChangesClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            await this._organizationService.saveSettings(this.settings!);

            this._changeDetector.markAsUnchanged();
        });

        this.operation.promise.catch(error =>
        {
            Log.error("Could not save the organization settings", error);
        });
    }
}
