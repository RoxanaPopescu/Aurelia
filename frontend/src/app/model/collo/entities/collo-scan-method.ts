import { textCase } from "shared/utilities";
import scanMethod from "../resources/strings/collo-scan-methods.json"

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
        "scanned":
        {
            name: scanMethod.scanned
        },
        "selected":
        {
            name: scanMethod.selected
        },
        "manually":
        {
            name: scanMethod.manually
        }
    };
}
