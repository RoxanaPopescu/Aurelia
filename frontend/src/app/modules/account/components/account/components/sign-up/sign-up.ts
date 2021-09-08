import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { AccountService, IAccountInit } from "app/modules/account/services/account";
import { OrganizationInfo, OrganizationService } from "app/model/organization";

export interface ISignUpModel extends Partial<IAccountInit>
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "sign-up";

    /**
     * The ID of the invite to present, if any.
     */
    inviteId: string | undefined;

    /**
     * The name of the organization.
     */
    organizationName?: string;

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
}

@autoinject
export class SignUpCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param accountService The `AccountService` instance.
     * @param organizationService The `OrganizationService` instance.
     */
    public constructor(identityService: IdentityService, accountService: AccountService, organizationService: OrganizationService)
    {
        this._identityService = identityService;
        this._accountService = accountService;
        this._organizationService = organizationService;
    }

    private readonly _identityService: IdentityService;
    private readonly _accountService: AccountService;
    private readonly _organizationService: OrganizationService;

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
        this.model.done = this._identityService.identity != null;
    }

    /**
     * The suggested preferred name, based on the full name.
     */
    @computedFrom("model.fullName")
    protected get preferredNameSuggestion(): string | undefined
    {
        return this.model.fullName?.replace(/\s.*/, "") || undefined;
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
            this.onSignUpClick();

            return false;
        }

        return true;
    }

    /**
     * Called when the `Sign up` button is pressed.
     */
    protected async onSignUpClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        this.model.busy = true;

        try
        {
            try
            {
                await this._accountService.create(
                {
                    fullName: this.model.fullName!,
                    preferredName: this.model.preferredName!,
                    email: this.model.email!,
                    password: this.model.password!
                });
            }
            catch (error)
            {
                Log.error("An error occurred while signing up.", error);

                return;
            }

            try
            {
                await this._identityService.authenticate(this.model.email!, this.model.password!);
            }
            catch (error)
            {
                Log.error("An error occurred while signing in.", error);

                return;
            }

            let organization: OrganizationInfo | undefined;

            if (this.model.organizationName != null)
            {
                try
                {
                    organization = await this._organizationService.create(
                    {
                        type: "business",
                        name: this.model.organizationName
                    });
                }
                catch (error)
                {
                    Log.error("An error occurred while creating the organization.", error);
                }
            }

            if (organization != null)
            {
                try
                {
                    // NOTE:
                    // The organization is created asynchronously, so failed API requests are to be expected.
                    // However, due to the retry logic, authorization should eventually succeed.
                    await this._identityService.authorize(organization.id, true);
                }
                catch (error)
                {
                    Log.error("An error occurred while signing in to the organization.", error);
                }
            }

            // tslint:disable-next-line: await-promise
            await this.model.onSignedUp?.();

            this.model.done = true;
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
