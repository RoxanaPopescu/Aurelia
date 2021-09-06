import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { AccountService } from "app/modules/account/services/account";

export interface IChangePasswordModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "change-password";

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
     * True to store an authentication cookie on the device, otherwise false.
     */
    remember?: boolean;

    /**
     * The function to call when the operation completes.
     */
    onChangedPassword?: () => unknown | Promise<unknown>;

    /**
     * True if the operation is pending, otherwise false.
     */
    busy?: boolean;

    /**
     * True if the operation was completed, otherwise false.
     */
    done?: boolean;
}

@autoinject
export class ChangePasswordCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param accountService The `AccountService` instance.
     */
    public constructor(identityService: IdentityService, accountService: AccountService)
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
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        if (!this.model.token)
        {
            Log.error("No token specified.");
        }
    }

    /**
     * Called when a key is pressed.
     * Submits the form if the `Enter` key is pressed.
     * @param event The keyboard event.
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
            // tslint:disable-next-line: no-floating-promises
            this.onChangePasswordClick();

            return false;
        }

        return true;
    }

    /**
     * Called when the `Request new password` button is pressed.
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

            const result = await this._accountService.changePasswordUsingToken(this.model.token!, this.model.password!);

            try
            {
                await this._identityService.authenticate(result.email, this.model.password!, this.model.remember);
            }
            catch (error)
            {
                Log.error("An error occurred while signing in.", error);

                return;
            }

            // tslint:disable-next-line: await-promise
            await this.model.onChangedPassword?.();

            this.model.done = true;
        }
        catch (error)
        {
            Log.error("An error occurred while changing the password.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
