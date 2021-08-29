import { autoinject } from "aurelia-framework";
import { AccountSubPage } from "../account-sub-page";

/**
 * Represents the URL parameters expected by the page.
 */
interface IConfirmEmailPageParams
{
    /**
     * The account confirmation token.
     */
    token: string;

    /**
     * The URL to navigate to after the email is confirmed.
     */
    url?: string;
}

@autoinject
export class ConfirmEmailPage extends AccountSubPage
{
    /**
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: IConfirmEmailPageParams): void
    {
        this.configure({ view: "confirm-email", token: params.token }, params.url);
    }
}
