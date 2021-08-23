import { autoinject, bindable } from "aurelia-framework";
import { OrganizationUser } from "app/model/organization";
import { AccountService } from "app/modules/account/services/account";

/**
 * Represents a tab pane for managing security for a user.
 */
@autoinject
export class SecurityPaneCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param accountService The `AccountService` instance.
     */
    public constructor(accountService: AccountService)
    {
        this._accountService = accountService;
    }

    private readonly _accountService: AccountService;

    /**
     * The user to present.
     */
    @bindable
    public user: Partial<OrganizationUser>;

    /**
     * Called when the `Reset password` button is clicked.
     */
    protected async onResetPasswordClick(): Promise<void>
    {
        await this._accountService.forgotPassword(this.user.email!);

        alert("An email has been sent to the user, with instructions to change their password")
    }
}
