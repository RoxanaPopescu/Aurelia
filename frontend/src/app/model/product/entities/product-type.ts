import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `ProductType`.
 */
export type ProductTypeSlug = keyof typeof ProductType.values;

/**
 * Represents the type of a product.
 */
export class ProductType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the type of the route.
     */
    public constructor(slug: ProductTypeSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as ProductTypeSlug;
        Object.assign(this, ProductType.values[this.slug]);
    }

    public slug: ProductTypeSlug;
    public name: string;

    public static readonly values =
    {
        "curier-eco":
        {
            name: "Curier ECO"
        },
        "curier-express":
        {
            name: "Curier Express"
        },
        "solution":
        {
            name: "Solution"
        }
    };
}
