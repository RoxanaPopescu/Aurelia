import { textCase } from "shared/utilities";
import types from "../resources/strings/deviation-type-names.json";

/**
 * Represents the slug identifying a `ColloScanMethod`.
 */
export type DeviationTypeSlug = keyof typeof DeviationType.values;

/**
 * Represents the method by which a collo was scanned.
 */
export class DeviationType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the collo.
     */
    public constructor(slug: DeviationTypeSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, DeviationType.values[this.slug]);
    }

    public slug: DeviationTypeSlug;
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
        "missing":
        {
            name: types.missing
        },
        "damaged":
        {
            name: types.damaged
        },
        "rejected":
        {
            name: types.rejected
        },
        "not-collected":
        {
            name: types["not-collected"]
        }
    };
}
