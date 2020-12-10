import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { AccountService } from "../../../../services/account";

export interface IForgotPasswordModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "forgot-password";

    /**
     * The email identifying the user.
     */
    email?: string;

    /**
     * True if the operation is pending, otherwise false.
     */
    busy?: boolean;

    /**
     * True if the operation was completed, otherwise false.
     */
    done?: boolean;

    /**
     * The error that occurred while executing the operation, if any.
     */
    error?: Error;
}

@autoinject
export class ForgotPasswordCustomElement
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
     * The model representing the state of the component.
     */
    @bindable
    protected model: IForgotPasswordModel;

    /**
     * The validation for the component.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the component is binding.
     * Resets the `done` state of the component.
     */
    public bind(): void
    {
        this.model.busy = false;
        this.model.done = false;
    }

    /**
     * Called when a key is pressed.
     * Submits the form if the `Enter` key is pressed.
     * @returns True to continue, false to prevent default.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        if (event.defaultPrevented || event.altKey || event.metaKey || event.shiftKey || event.ctrlKey)
        {
            return true;
        }

        if (event.key === "Enter")
        {
            this.onRequestNewPasswordClick().catch();

            return false;
        }

        return true;
    }

    /**
     * Called when the `Request new password` button is pressed.
     * Submits the form.
     */
    protected async onRequestNewPasswordClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            this.model.busy = true;

            await this._accountService.forgotPassword(this.model.email!);

            this.model.error = undefined;
            this.model.done = true;
        }
        catch (error)
        {
            this.model.error = error;

            Log.error("Password recovery failed.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
