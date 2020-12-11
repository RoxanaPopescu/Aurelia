import { autoinject, bindable } from "aurelia-framework";
import { ISignUpModel } from "./components/sign-up/sign-up";
import { ISignInModel } from "./components/sign-in/sign-in";
import { ISignOutModel } from "./components/sign-out/sign-out";
import { IActivateModel } from "./components/activate/activate";
import { IForgotPasswordModel } from "./components/forgot-password/forgot-password";
import { IChangePasswordModel } from "./components/change-password/change-password";

type AccountCallbacks = Pick<ISignUpModel, "onSignedUp"> & Pick<ISignInModel, "onSignedIn">;

/**
 * Represents the model for the `account` component.
 */
export type AccountModel =
(
    ISignUpModel & AccountCallbacks |
    IActivateModel & AccountCallbacks |
    ISignInModel & AccountCallbacks |
    IForgotPasswordModel & AccountCallbacks |
    IChangePasswordModel & AccountCallbacks |
    ISignOutModel & AccountCallbacks

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
