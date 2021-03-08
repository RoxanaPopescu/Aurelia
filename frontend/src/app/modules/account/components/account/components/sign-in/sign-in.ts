import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { IdentityService } from "app/services/identity";

export interface ISignInModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "sign-in";

    /**
     * The email identifying the user.
     */
    email?: string;

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
    onSignedIn?: () => unknown | Promise<unknown>;

    /**
     * The function to call when the view is changed.
     */
    onViewChanged?: () => unknown;

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
export class SignInCustomElement
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
     * The model representing the state of the component.
     */
    @bindable
    protected model: ISignInModel;

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
            this.onSignInClick().catch();

            return false;
        }

        return true;
    }

    /**
     * Called when the `Forgot password` button is pressed.
     * Submits the form.
     */
    protected onForgotPasswordClick(): void
    {
        this.model.view = "forgot-password" as any;
        this.model.onViewChanged?.();
    }

    /**
     * Called when the `Sign up` button is pressed.
     * Submits the form.
     */
    protected async onSignInClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        let success: boolean;

        try
        {
            this.model.busy = true;

            success = await this._identityService.authenticate(this.model.email!, this.model.password!, this.model.remember!);

            if (success)
            {
                // tslint:disable-next-line: await-promise
                await this.model.onSignedIn?.();

                this.model.error = undefined;
                this.model.done = true;
            }
            else
            {
                Log.error("Invalid username or password");
            }
        }
        catch (error)
        {
            this.model.error = error;

            Log.error("Sign in failed.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}