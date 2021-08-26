import { textCase } from "shared/utilities/text";
import stopType from "../resources/strings/order-stop-types.json";

/**
 * Represents the slug identifying a `RouteStopType`.
 */
export type OrderStopTypeSlug = keyof typeof OrderStopType.values;

/**
 * Represents the type of a route stop.
 */
export class OrderStopType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the type of the route stop.
     */
    public constructor(slug: OrderStopTypeSlug)
    {
        this.slug = slug ? textCase(slug, "pascal", "kebab") as any : "pickup";
        Object.assign(this, OrderStopType.values[this.slug]);
    }

    public slug: OrderStopTypeSlug;
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
        "pickup":
        {
            name: stopType.pickup
        },
        "delivery":
        {
            name: stopType.delivery
        }
    };
}
