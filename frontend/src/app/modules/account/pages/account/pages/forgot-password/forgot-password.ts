import { autoinject } from "aurelia-framework";
import { AccountSubPage } from "../account-sub-page";

/**
 * Represents the URL parameters expected by the page.
 */
interface IForgotPasswordPageParams
{
    /**
     * The URL to navigate to after ForgotPasswordg in.
     */
    url?: string;

    /**
     * The ID of the invite to present, if any.
     */
    invite: string | undefined;
}

@autoinject
export class ForgotPasswordPage extends AccountSubPage
{
    /**
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: IForgotPasswordPageParams): void
    {
        this.configure({ view: "forgot-password" }, params.url, params.invite);
    }
}
