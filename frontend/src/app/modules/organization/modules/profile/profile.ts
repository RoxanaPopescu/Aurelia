import { autoinject } from "aurelia-framework";
import { AbortError } from "shared/types";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationProfile } from "app/model/organization";

/**
 * Represents the page.
 */
@autoinject
export class ProfilePage
{
    /**
     * Creates a new instance of the class.
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(identityService: IdentityService, organizationService: OrganizationService)
    {
        this.organizationId = identityService.identity!.organization!.id;
        this.readonly = !identityService.identity!.claims.has("edit-organization");

        this._organizationService = organizationService;
    }

    private readonly _organizationService: OrganizationService;

    /**
     * The most recent operation.
     */
    protected operation: Operation;

    /**
     * The ID of the organization.
     */
    protected organizationId: string | undefined;

    /**
     * The profile for the organization.
     */
    protected profile: OrganizationProfile | undefined;

    /**
     * True if the profile is readonly, otherwise false.
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
            this.profile = await this._organizationService.getProfile(signal);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the organization profile", error);
            }
        });
    }

    /**
     * Called when the `Save changes` button is clicked.
     * Saves the changes made to the profile.
     */
    protected onSaveChangesClick(): void
    {
        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            await this._organizationService.saveProfile(this.profile!);
        });

        this.operation.promise.catch(error =>
        {
            Log.error("Could not save the organization profile", error);
        });
    }

    /**
     * Called when the `Copy to clipboard` icon is clicked in the ID input.
     * Copies the ID to the clipboard.
     */
    protected async onCopyIdToClipboard(): Promise<void>
    {
        try
        {
            await navigator.clipboard.writeText(this.organizationId!);
        }
        catch (error)
        {
            Log.error("Could not copy the text to clipboard", error);
        }
    }
}
