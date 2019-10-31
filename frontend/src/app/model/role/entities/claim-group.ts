/**
 * Represents a named group of claims.
 */
export class ClaimGroup
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.groupId;
        this.name = data.groupName;
    }

    /**
     * The ID of the claim group
     */
    public id: string;

    /**
     * The name of the claim group.
     */
    public name: string;
}
