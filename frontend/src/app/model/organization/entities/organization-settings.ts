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
        this.tracking = new OrganizationTracking(
        {
            support:
            {
                phone: "+45 70 15 09 09",
                email: undefined,
                note:
                {
                    "en-US": "<p>We are ready to answer your call from 09:00 to 20:00 on weekdays and 09:00 to 18:00 on weekends, except on public holidays.</p>"
                }
            },
            customizeDelivery: false,
            links:
            {
                orderDetailsUrlPattern: undefined,
                termsAndConditionsUrl: undefined
            },
            authorityToLeave:
            {
                standardLocations: undefined,
                customLocation: false,
                customInstruction: false
            }});
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
