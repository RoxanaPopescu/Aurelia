import { textCase } from "shared/utilities";

/**
 * Represents the slug identifying a `ColloScanMethod`.
 */
export type ColloScanMethodSlug = keyof typeof ColloScanMethod.values;

/**
 * Represents the method by which a collo was scanned.
 */
export class ColloScanMethod
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the collo.
     */
    public constructor(slug: ColloScanMethodSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, ColloScanMethod.values[this.slug]);
    }

    public slug: ColloScanMethodSlug;
    public name: string;

    public static readonly values =
    {
        "scanned":
        {
            name: "Scanned"
        },
        "selected":
        {
            name: "Selected"
        },
        "manually":
        {
            name: "Manually"
        }
    };
}
