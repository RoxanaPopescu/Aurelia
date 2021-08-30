import { IdentityService } from "app/services/identity";
import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";

/**
 * Represents a modal dialog that asks the user to enter their password,
 * verifies the validity of the password, and finally returns the password.
 */
@autoinject
export class VerifyPasswordDialog
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(modal: Modal, identityService: IdentityService)
    {
        this._modal = modal;
        this._identityService = identityService;
    }

    private readonly _modal: Modal;
    private readonly _identityService: IdentityService;
    private _result = false;

    protected password: string | undefined;
    protected invalid = false;

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The verified password provided by the user, or undefined if the dialog was cancelled.
     */
    public async deactivate(): Promise<string | undefined>
    {
        if (!this._result || !this.password)
        {
            return undefined;
        }

        const valid = await this._identityService.verifyPassword(this.password);

        if (!valid)
        {
            this.invalid = true;

            // tslint:disable-next-line: no-string-throw
            throw "Invalid password";
        }

        return this.password;
    }

    /**
     * Called when one of the buttons are clicked.
     */
    protected async onButtonClick(result: boolean): Promise<void>
    {
        if (result && !this.password)
        {
            this.invalid = true;
        }
        else
        {
            this._result = result;

            await this._modal.close();
        }
    }
}
