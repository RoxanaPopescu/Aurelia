import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { AccountService } from "app/modules/account/services/account";
import { IAccountInit } from "app/modules/account/services/account/account-init";
import { PhoneNumber } from "app/model/shared";

export interface ISignUpModel extends Partial<IAccountInit>
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "sign-up";

    /**
     * The full name of the user.
     */
    fullName?: string;

    /**
     * The preferred name of the user.
     */
    preferredName?: string;

    /**
     * The email identifying the user.
     */
    email?: string;

    /**
     * The password specified by the user.
     */
    password?: string;

    /**
     * The phone number specified by the user.
     */
    phoneNumber?: PhoneNumber;

    /**
     * True if the user accepts the terms of service, otherwise false.
     */
    acceptTerms?: boolean;

    /**
     * The function to call when the operation completes.
     */
    onSignedUp?: () => unknown | Promise<unknown>;

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
export class SignUpCustomElement
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
    protected model: ISignUpModel;

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
     * The suggested preferred name, based on teh full name.
     */
    @computedFrom("model.fullName")
    protected get preferredNameSuggestion(): string | undefined
    {
        return this.model.fullName?.replace(/\s.*/, "") || undefined;
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
            this.onSignUpClick().catch();

            return false;
        }

        return true;
    }

    /**
     * Called when the `Sign up` button is pressed.
     * Submits the form.
     */
    protected async onSignUpClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            this.model.busy = true;

            await this._accountService.create(
            {
                fullName: this.model.fullName!,
                preferredName: this.model.preferredName!,
                email: this.model.email!,
                password: this.model.password!
            });

            // tslint:disable-next-line: await-promise
            await this.model.onSignedUp?.();

            this.model.error = undefined;
            this.model.done = true;
        }
        catch (error)
        {
            this.model.error = error;

            Log.error("Sign up failed.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
