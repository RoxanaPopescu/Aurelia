/**
 * Represents the slug identifying a `OutfitType`.
 */
export type OutfitTypeSlug = keyof typeof OutfitType.values;

/**
 * Represents the type of an outfit.
 */
export class OutfitType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the type of the outfit.
     */
    public constructor(slug: OutfitTypeSlug)
    {
        this.slug = slug;
        Object.assign(this, OutfitType.values[this.slug]);
    }

    public slug: OutfitTypeSlug;
    public name: string;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return this.slug;
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "fulfiller":
        {
            name: "Fulfiller"
        },
        "consignor":
        {
            name: "Consignor"
        },
        "consignee":
        {
            name: "Consignee"
        },
        "system":
        {
            name: "System"
        },
        "unknown":
        {
            name: "Unknown"
        }
    };
}
