import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { OrganizationUser } from "app/model/organization";

/**
 * Represents a tab pane for managing the profile for a user.
 */
@autoinject
export class ProfilePaneCustomElement
{
    /**
     * The user to present.
     */
    @bindable
    public user: OrganizationUser;

    /**
     * The strings from which initials should be generated.
     */
    @computedFrom("user.preferredName")
    protected get initials(): (string | undefined)[]
    {
        return [this.user.preferredName];
    }
}
