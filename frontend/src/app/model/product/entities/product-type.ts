import { textCase } from "shared/utilities/text";
import productType from "../resources/strings/product-types.json";

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
        "courier-eco":
        {
            name: productType.courierECO
        },
        "courier-express":
        {
            name: productType.courierExpress
        },
        "solution":
        {
            name: productType.solution
        }
    };
}
