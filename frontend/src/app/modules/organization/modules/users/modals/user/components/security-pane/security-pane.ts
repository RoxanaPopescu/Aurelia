import { autoinject, bindable } from "aurelia-framework";
import { OrganizationUser } from "app/model/organization";
import { AccountService } from "app/modules/account/services/account";
import { ModalService } from "shared/framework";
import { ConfirmForgotPasswordDialog } from "./modals/confirm-forgot-password/confirm-forgot-password";
import { Log } from "shared/infrastructure";

/**
 * Represents a tab pane for managing security for a user.
 */
@autoinject
export class SecurityPaneCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param accountService The `AccountService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(accountService: AccountService, modalService: ModalService)
    {
        this._accountService = accountService;
        this._modalService = modalService;
    }

    private readonly _accountService: AccountService;
    private readonly _modalService: ModalService;

    /**
     * The user to present.
     */
    @bindable
    public user: OrganizationUser;

    /**
     * Called when the `Forgot password` button is clicked.
     */
    protected async onResetPasswordClick(): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmForgotPasswordDialog, this.user).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._accountService.forgotPassword(this.user.email);
        }
        catch (error)
        {
            Log.error("Could not send recovery email", error);
        }
    }
}
