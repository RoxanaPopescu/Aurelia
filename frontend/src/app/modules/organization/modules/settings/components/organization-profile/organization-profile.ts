import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { OrganizationProfile } from "app/model/organization";

/**
 * Represents the profile view.
 */
@autoinject
export class OrganizationProfileCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this.organizationId = identityService.identity!.organization!.id;
    }

    /**
     * The ID of the organization.
     */
    protected organizationId: string | undefined;

    /**
     * The profile settings for the organization.
     */
    @bindable
    public profile: OrganizationProfile | undefined;

    /**
     * True if the settings are readonly, otherwise false.
     */
    @bindable
    public readonly: boolean;

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
