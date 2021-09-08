import { autoinject } from "aurelia-framework";
import { NavigationCommand, Redirect } from "aurelia-router";
import { AccountSubPage } from "../account-sub-page";

/**
 * Represents the URL parameters expected by the page.
 */
interface ICreateOrganizationPageParams
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
export class CreateOrganizationPage extends AccountSubPage
{
    /**
     * Called by the framework before the page activates.
     */
    public canActivate(): NavigationCommand | boolean
    {
        if (this.identityService.identity == null)
        {
            return new Redirect(this.historyHelper.getRouteUrl("/account/sign-in"));
        }

        return true;
    }

    /**
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: ICreateOrganizationPageParams): void
    {
        this.configure({ view: "create-organization" }, params.url, params.invite);
    }
}
