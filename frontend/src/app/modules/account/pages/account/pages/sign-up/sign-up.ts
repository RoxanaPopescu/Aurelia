import { autoinject } from "aurelia-framework";
import { NavigationCommand, Redirect } from "aurelia-router";
import { AccountSubPage } from "../account-sub-page";

/**
 * Represents the URL parameters expected by the page.
 */
interface ISignUpPageParams
{
    /**
     * The URL to navigate to after signing up.
     */
    url?: string;
}

@autoinject
export class SignUpPage extends AccountSubPage
{
    /**
     * Called by the framework before the page activates.
     * @param params The route parameters from the URL.
     */
    public canActivate(params: ISignUpPageParams): NavigationCommand | boolean
    {
        if (this.identityService.identity != null)
        {
            return new Redirect(this.historyHelper.getRouteUrl(params.url ?? "/"));
        }

        return true;
    }

    /**
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: ISignUpPageParams): void
    {
        this.configure({ view: "sign-up" }, params.url);
    }
}
