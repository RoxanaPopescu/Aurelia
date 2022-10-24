import { autoinject, bindable } from "aurelia-framework";
import { OrganizationTracking } from "app/model/organization";

/**
 * Represents the profile view.
 */
@autoinject
export class OrganizationTrackingCustomElement
{
    /**
     * The tracking settings for the organization.
     */
    @bindable
    public tracking: OrganizationTracking | undefined;

    /**
     * True if the settings is readonly, otherwise false.
     */
    @bindable
    public readonly: boolean;
}
