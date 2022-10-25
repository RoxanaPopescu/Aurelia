import { OrganizationProfile } from "./organization-profile";
import { OrderTrackingSettings } from "app/model/order-tracking";

/**
 * Represents the settings for an organization.
 */
export class OrganizationSettings
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.profile = new OrganizationProfile(data);
    }

    /**
     * The profile of the organization.
     */
    public profile: OrganizationProfile;

    /**
     * The tracking settings for the organization.
     */
    public tracking: OrderTrackingSettings;

    public toJSON(): any
    {
        return this.profile;
    }
}
