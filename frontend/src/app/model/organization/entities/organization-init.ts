/**
 * Represents the data needed to create a new organization.
 */
export interface IOrganizationInit
{
    /**
     * The name of the organization.
     */
    name: string;

    /**
     * The type of organization to create.
     */
    type: "business" | "private";
}
