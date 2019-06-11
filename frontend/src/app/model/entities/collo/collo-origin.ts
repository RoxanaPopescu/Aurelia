/**
 * Represents the slug identifying a `ColloOrigin`.
 */
export type ColloOriginSlug = keyof typeof ColloOrigin.map;

/**
 * Represents the origin of the collo entry.
 */
export class ColloOrigin
{

    public constructor(slug: ColloOriginSlug)
    {
        this.slug = slug;
        Object.assign(this, ColloOrigin.map[slug]);
    }

    public slug: ColloOriginSlug;
    public name: string;

    public static readonly map =
    {
        "regular":
        {
            name: ""
        },
        "added-by-driver":
        {
            name: "Added by driver"
        }
    };
}
