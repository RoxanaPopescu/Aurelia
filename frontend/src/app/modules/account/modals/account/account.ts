import { autoinject } from "aurelia-framework";
import { IdentityService, Identity } from "app/services/identity";

/**
 * Represents the global `account` modal panel.
 * This allows the user to manage profile and account settings.
 */
@autoinject
export class AccountModalPanel
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this._identityService = identityService;
    }

    private readonly _identityService: IdentityService;

    /**
     * The identity of the current user.
     */
    protected identity: Identity;

    /**
     * The name of the selected tab.
     */
    protected selectedTab: "profile" | "settings" | "account" = "profile";

    /**
     * Called by the framework when the modal is activating.
     */
    public activate(): void
    {
        if (this._identityService.identity == null)
        {
            throw new Error("Cannot show panel when the user is not authenticated.");
        }

        // Get the profile for the current user.
        this.identity = this._identityService.identity;
    }
}
