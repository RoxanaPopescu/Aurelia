/**
 * Represents an address identifying a place in the world.
 */
export class Address
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.provider = data.provider;
            this.primary = data.primary;
            this.secondary = data.secondary;
        }
    }

    /**
     * The ID of the address, if available.
     */
    public id?: string;

    /**
     * The name identifying the provider of the address.
     */
    public provider?: string;

    /**
     * The primary address information.
     */
    public primary: string;

    /**
     * The secondary address information.
     */
    public secondary?: string;

    /**
     * Formats the address for presentation on a single line.
     */
    public toString(): string
    {
        return this.secondary ? `${this.primary}, ${this.secondary}` : this.primary;
    }
}
