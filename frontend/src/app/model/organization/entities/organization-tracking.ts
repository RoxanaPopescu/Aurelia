import { AuthorityToLeaveLocationSlug } from "app/model/order-tracking";
import { MapObject } from "shared/types";

/**
 * Represents the tracking settings for an organization.
 */
export class OrganizationTracking
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.support = data.support;
        this.customizeDelivery = data.customizeDelivery;
        this.links = data.links;
        this.authorityToLeave = data.authorityToLeave;
    }

    /**
     * True to allow the user to customize their delivery, otherwise false.
     * Note: Currently, the only customization option is authority to leave.
     */
    public support:
    {
        phone: string | undefined;
        email: string | undefined;
        note: MapObject<string>;
    };

    /**
     * True to allow the user to customize their delivery, otherwise false.
     * Note: Currently, the only customization option is authority to leave.
     */
    public customizeDelivery: boolean;

    /**
     * The links to use on the tracking page.
     */
    public links:
    {
        orderDetailsUrlPattern: string | undefined;
        termsAndConditionsUrl: string | undefined;
    };

    /**
     * The authority to leave settings to use on the tracking page.
     */
    public authorityToLeave:
    {
        standardLocations: AuthorityToLeaveLocationSlug[] | undefined;
        customLocation: boolean;
        customInstruction: boolean;
    };
}
