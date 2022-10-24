import { OrganizationProfile } from "./organization-profile";
import { OrganizationTracking } from "./organization-tracking";

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
        // TODO: FOR TESTING ONLY!
        this.profile = new OrganizationProfile(data);
        this.tracking = new OrganizationProfile({});
    }

    /**
     * The profile of the organization.
     */
    public profile: OrganizationProfile;

    /**
     * The tracking settings for the organization.
     */
    public tracking: OrganizationTracking;

    // TODO: FOR TESTING ONLY!
    public toJSON(): any
    {
        return this.profile;
    }
}
