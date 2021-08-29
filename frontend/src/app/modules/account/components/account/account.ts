import { autoinject, bindable } from "aurelia-framework";
import { IdentityService } from "app/services/identity";
import { ISignUpModel } from "./components/sign-up/sign-up";
import { ISignInModel } from "./components/sign-in/sign-in";
import { ISignOutModel } from "./components/sign-out/sign-out";
import { IConfirmEmailModel } from "./components/confirm-email/confirm-email";
import { IForgotPasswordModel } from "./components/forgot-password/forgot-password";
import { IChangePasswordModel } from "./components/change-password/change-password";
import { IChooseOrganizationModel } from "./components/choose-organization/choose-organization";
import { ICreateOrganizationModel } from "./components/create-organization/create-organization";

/**
 * Represents the model for the `account` component.
 */
export type AccountModel =
(
    ISignUpModel |
    IConfirmEmailModel |
    ISignInModel |
    IForgotPasswordModel |
    IChangePasswordModel |
    ISignOutModel |
    IChooseOrganizationModel |
    ICreateOrganizationModel
) &
{
    /**
     * The function to call when the view is changed.
     */
    onViewChanged?: () => unknown;
};

/**
 * Represents the slug identifying a view in the `account` component.
 */
export type AccountView = AccountModel["view"];

/**
 * Represents the `account` component.
 */
@autoinject
export class AccountCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this.identityService = identityService;
    }

    /**
     * The `IdentityService` instance.
     */
    protected readonly identityService: IdentityService;

    /**
     * The model representing the state of the component.
     */
    @bindable({ defaultValue: { view: "sign-up" }})
    protected model: AccountModel;

    /**
     * Sets the view presented by the component.
     * @param view The view to present.
     */
    public setView(view: AccountView): void
    {
        this.model.view = view;
        this.model.onViewChanged?.();
    }
}
