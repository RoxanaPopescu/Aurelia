import { autoinject } from "aurelia-framework";
import { AccountSubPage } from "../account-sub-page";

/**
 * Represents the URL parameters expected by the page.
 */
interface IChangePasswordPageParams
{
    /**
     * The account confirmation token, or undefined if already authenticated.
     */
    token?: string;

    /**
     * The URL to navigate to after the password is changed.
     */
    url?: string;
}

@autoinject
export class ChangePasswordPage extends AccountSubPage
{
    /**
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: IChangePasswordPageParams): void
    {
        this.configure({ view: "change-password", token: params.token }, params.url);
    }
}
