/**
 * Represents the profile of an organization.
 */
export class OrganizationProfile
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.name = data.name;
    }

    /**
     * The name of the organization.
     */
    public name: string;
}
