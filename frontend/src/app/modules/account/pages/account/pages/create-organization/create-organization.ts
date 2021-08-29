import { autoinject } from "aurelia-framework";
import { NavigationCommand, Redirect } from "aurelia-router";
import { AccountSubPage } from "../account-sub-page";

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
     */
    public activate(): void
    {
        this.configure({ view: "create-organization" });
    }
}
