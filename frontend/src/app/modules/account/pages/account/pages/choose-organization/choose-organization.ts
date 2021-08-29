import { autoinject } from "aurelia-framework";
import { NavigationCommand, Redirect } from "aurelia-router";
import { AccountSubPage } from "../account-sub-page";

/**
 * Represents the URL parameters expected by the page.
 */
interface IChooseOrganizationPageParams
{
    /**
     * The URL to navigate to after signing in, or undefiend to not navigate.
     */
    url?: string;
}

@autoinject
export class ChooseOrganizationPage extends AccountSubPage
{
    /**
     * Called by the framework before the page activates.
     * @param params The route parameters from the URL.
     */
    public canActivate(params: IChooseOrganizationPageParams): NavigationCommand | boolean
    {
        if (this.identityService.identity == null)
        {
            return new Redirect(params.url && params.url !== "/"
                ? this.historyHelper.getRouteUrl(`/account/sign-in?url=${encodeURIComponent(params.url)}`)
                : this.historyHelper.getRouteUrl("/account/sign-in"));
        }

        return true;
    }

    /**
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: IChooseOrganizationPageParams): void
    {
        this.configure({ view: "choose-organization" }, params.url);
    }
}
