import { autoinject } from "aurelia-framework";
import { AbortError } from "shared/types";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { ChangeDetector, IValidation } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrderTrackingService, AuthorityToLeaveLocation, OrderTrackingSettings, OrderTrackingLocale } from "app/model/order-tracking";

/**
 * Represents the page.
 */
@autoinject
export class TrackingPage
{
    /**
     * Creates a new instance of the class.
     * @param identityService The `IdentityService` instance.
     * @param orderTrackingService The `OrderTrackingService` instance.
     */
    public constructor(identityService: IdentityService, orderTrackingService: OrderTrackingService)
    {
        this.readonly = !identityService.identity!.claims.has("edit-organizations");

        this._orderTrackingService = orderTrackingService;
    }

    private readonly _orderTrackingService: OrderTrackingService;
    private _changeDetector: ChangeDetector;

    /**
     * The standard locations for authority to leave.
     */
    protected readonly authorityToLeaveLocations = Object.keys(AuthorityToLeaveLocation.values).map(key => new AuthorityToLeaveLocation(key as any));

    /**
     * The locales supported by the tracking page.
     */
    protected readonly availableLocales = Object.keys(OrderTrackingLocale.values).map(key => new OrderTrackingLocale(key as any));

    /**
     * The selected locale for the support note input.
     */
    protected readonly supportNoteLocale: OrderTrackingLocale = this.availableLocales.find(l => l.code === "en")!;

    /**
     * The selected locale for the custom location note.
     */
    protected readonly customLocationNoteLocale: OrderTrackingLocale = this.availableLocales.find(l => l.code === "en")!;

    /**
     * The most recent operation.
     */
    protected operation: Operation;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The settings for the organization.
     */
    protected settings: OrderTrackingSettings | undefined;

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
            this.settings = (await this._orderTrackingService.getSettings(signal));

            this._changeDetector = new ChangeDetector(() => this.settings);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the order tracking settings", error);
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
            await this._orderTrackingService.saveSettings(this.settings!);

            this._changeDetector.markAsUnchanged();
        });

        this.operation.promise.catch(error =>
        {
            Log.error("Could not save the order tracking settings", error);
        });
    }
}
