import { textCase } from "shared/utilities";

/**
 * Represents the slug identifying a `ColloOrigin`.
 */
export type ColloOriginSlug = keyof typeof ColloOrigin.values;

/**
 * Represents the origin of a collo.
 */
export class ColloOrigin
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the origin of the collo.
     */
    public constructor(slug: ColloOriginSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, ColloOrigin.values[this.slug]);
    }

    public slug: ColloOriginSlug;
    public name: string;

    public static readonly values =
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
