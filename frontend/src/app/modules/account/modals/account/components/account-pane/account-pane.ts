import { autoinject } from "aurelia-framework";
import { AppRouter } from "aurelia-router";
import { IdentityService } from "app/services/identity";

/**
 * Represents a tab pane for managing the account for the current user.
 */
@autoinject
export class AccountPaneCustomElement
{

    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param router The `Router` instance.
     */
    public constructor(identityService: IdentityService, router: AppRouter)
    {
        this._identityService = identityService;
        this._router = router;
    }

    private readonly _identityService: IdentityService;
    private readonly _router: AppRouter;

    /**
     * Called when the "Sign out" button is clicked.
     * Unauthenticates the user, them navigates to the sign in page.
     */
    protected async onSignOutClick(): Promise<void>
    {
        await this._identityService.unauthenticate();

        this._router.navigate("/account/sign-in");
    }
}
