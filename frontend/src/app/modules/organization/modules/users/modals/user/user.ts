import { autoinject } from "aurelia-framework";
import { OrganizationUser } from "app/model/organization";

 /**
  * Represents a modal panel that presents the public profile of a user.
  */
@autoinject
export class UserModalPanel
{
    /**
     * The name of the selected tab.
     */
    protected selectedTab: "profile" | "security" = "profile";

    /**
     * The user to present.
     */
    protected user: OrganizationUser;

    /**
     * Called by the framework when the modal is activating.
     * @param user The user to present.
     */
    public activate(user: OrganizationUser): void
    {
        this.user = user;
    }
}
