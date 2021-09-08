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

    /**
     * The ID of the invite to present, if any.
     */
    invite: string | undefined;
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
            const url = this.getUrlWithQuery("/account/sign-in", { url: params.url, invite: params.invite });

            return new Redirect(this.historyHelper.getRouteUrl(url));
        }

        return true;
    }

    /**
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: IChooseOrganizationPageParams): void
    {
        this.configure({ view: "choose-organization", inviteId: params.invite }, params.url, params.invite);
    }
}
