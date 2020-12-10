import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { AccountService } from "app/modules/account/services/account";
import { IdentityService } from "app/services/identity";

export interface IChangePasswordModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "change-password";

    /**
     * The email address identifying the user.
     */
    email?: string;

    /**
     * The token specified in the recovery link sent to the user,
     * or undefined if already authenticated.
     */
    token?: string | undefined;

    /**
     * The password specified by the user.
     */
    password?: string;

    /**
     * True to store the auth tokens on the device, otherwise false.
     */
    remember?: boolean;

    /**
     * The function to call when the operation completes.
     */
    onPasswordChanged?: () => unknown | Promise<unknown>;

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
export class ChangePasswordCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param accountService The `AccountService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(accountService: AccountService, identityService: IdentityService)
    {
        this._accountService = accountService;
        this._identityService = identityService;
    }

    private readonly _accountService: AccountService;
    private readonly _identityService: IdentityService;

    /**
     * The model representing the state of the component.
     */
    @bindable
    protected model: IChangePasswordModel;

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
     * Called when the component is attached.
     */
    public attached(): void
    {
        if (!this.model.email)
        {
            Log.error("No email specified.");
        }

        if (!this.model.token)
        {
            Log.error("No token specified.");
        }
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
            this.onChangePasswordClick().catch();

            return false;
        }

        return true;
    }

    /**
     * Called when the `Request new password` button is pressed.
     * Submits the form.
     */
    protected async onChangePasswordClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            this.model.busy = true;

            const tokens = await this._accountService.changePassword(this.model.email!, this.model.password!, this.model.token!);

            try
            {
                await this._identityService.authenticated({ ...tokens, remember: !!this.model.remember });
            }
            catch (error)
            {
                this.model.error = error;

                Log.error("Sign in failed.", error);

                return;
            }

            // tslint:disable-next-line: await-promise
            await this.model.onPasswordChanged?.();

            this.model.error = undefined;
            this.model.done = true;
        }
        catch (error)
        {
            this.model.error = error;

            Log.error("Password change failed.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
