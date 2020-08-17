/**
 * Represents an name
 */
export class Name
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.fullName = data.fullName;
            this.preferredName = data.preferredName;
        }
    }

    /**
     * The full name.
     */
    public fullName: string;

    /**
     * The preferredName .
     */
    public preferredName?: string;
}
