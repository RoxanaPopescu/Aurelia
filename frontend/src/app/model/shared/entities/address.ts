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
            this.id = data.id || undefined;
            this.provider = data.provider || undefined;
            this.primary = this.sanitize(data.primary);
            this.secondary = data.secondary ? this.sanitize(data.secondary) : undefined;
            this.zipCode = data.zipCode || undefined;
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
     * The zip code address information.
     */
    public zipCode?: string;

    /**
     * The primary address information.
     */
    public primary: string;

    /**
     * The secondary address information.
     */
    public secondary?: string;

    /**
     * Formats the address as a single-line string.
     */
    public toString(): string
    {
        return this.secondary ? `${this.primary}, ${this.secondary}` : this.primary;
    }

    /**
     * Formats the address as a multi-line HTML string.
     */
    public toHtmlString(): string
    {
        return this.secondary ?
            `${this.primary}<br>${this.secondary}` :
            this.primary.replace(/^(.*),\s*(\d{4}\s+[^\d]+)$/, ($0, $1, $2) => $2 ? `${$1}<br>${$2}` : $1);
    }

    /**
     * Sanitizes the specified address fragment.
     * @param addressFragment The address fragment to sanitize.
     * @returns The sanitized address fragment.
     */
    private sanitize(addressFragment: string): string
    {
        return addressFragment
            .replace(/\s+/g, " ")
            .replace(/,(?=[^ ])/g, ", ")
            .replace(/\s,/g, ",")
            .replace(/\s\./g, ".")
            .replace(/,$/g, "")
            .replace(/<|>/g, "")
            .trim();
    }
}
