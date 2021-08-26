import { textCase } from "shared/utilities";
import originNames from "../resources/strings/collo-origin-names.json";

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
        "regular":
        {
            name: originNames.regular
        },
        "added-by-driver":
        {
            name: originNames.addedByDriver
        }
    };
}
