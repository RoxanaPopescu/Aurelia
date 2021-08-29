import { autoinject } from "aurelia-framework";
import { NavigationCommand, Redirect } from "aurelia-router";
import { AccountSubPage } from "../account-sub-page";

/**
 * Represents the URL parameters expected by the page.
 */
interface ISignInPageParams
{
    /**
     * The URL to navigate to after signing in.
     */
    url?: string;
}

@autoinject
export class SignInPage extends AccountSubPage
{
    /**
     * Called by the framework before the page activates.
     * @param params The route parameters from the URL.
     */
    public canActivate(params: ISignInPageParams): NavigationCommand | boolean
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
    public activate(params: ISignInPageParams): void
    {
        this.configure({ view: "sign-in" }, params.url);
    }
}
