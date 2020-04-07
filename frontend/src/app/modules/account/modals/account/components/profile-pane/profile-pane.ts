import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Identity } from "app/services/identity";

/**
 * Represents a tab pane for managing the profile for the current user.
 */
@autoinject
export class ProfilePaneCustomElement
{
    /**
     * The model representing the identity for the current user.
     */
    @bindable
    public model: Partial<Identity>;

    /**
     * The strings from which initials should be generated.
     */
    @computedFrom("model.preferredName")
    protected get initials(): (string | undefined)[]
    {
        return [this.model.preferredName];
    }
}
