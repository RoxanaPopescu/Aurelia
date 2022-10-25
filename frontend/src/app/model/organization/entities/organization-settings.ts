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
        // TODO: FOR TESTING ONLY!
        this.profile = new OrganizationProfile(data);
        this.tracking = new OrderTrackingSettings(
        {
            support:
            {
                phone: "+45 70 15 09 09",
                email: undefined,
                note:
                {
                    "en": "We are ready to answer your call from 09:00 to 20:00 on weekdays and 09:00 to 18:00 on weekends, except on public holidays."
                }
            },
            customizeDelivery: true,
            links:
            {
                orderDetailsUrlPattern: undefined,
                termsAndConditionsUrl: "https://www.ikea.com/dk/da/customer-service/terms-conditions"
            },
            authorityToLeave:
            {
                standardLocations:
                [
                    "inFrontOfTheFrontDoor",
                    "atTheBackDoor",
                    "inTheGarage",
                    "inTheCarport",
                    "onTheTerrace",
                    "inTheGardenShed",
                    "inTheGreenhouse"
                ],
                customLocation: true,
                customInstruction: true
            }});
    }

    /**
     * The profile of the organization.
     */
    public profile: OrganizationProfile;

    /**
     * The tracking settings for the organization.
     */
    public tracking: OrderTrackingSettings;

    // TODO: FOR TESTING ONLY!
    public toJSON(): any
    {
        return this.profile;
    }
}
