import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";
import deliveryMethod from "../resources/strings/route-stop-delivery-methods.json"

/**
 * Represents the slug identifying a `RouteStopDeliveryMethod`.
 */
export type RouteStopDeliveryMethodSlug = keyof typeof RouteStopDeliveryMethod.values;

/**
 * Represents the deliver method of a route stop.
 */
export class RouteStopDeliveryMethod
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the delivery method of the route stop.
     */
    public constructor(slug: RouteStopDeliveryMethodSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, RouteStopDeliveryMethod.values[this.slug]);
    }

    public slug: RouteStopDeliveryMethodSlug;
    public name: string;
    public accent: Accent;

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
        "delivered-to-consumer":
        {
            name: deliveryMethod.deliveredToConsumer,
            accent: "neutral"
        },
        "left-at-agreed-location":
        {
            name: deliveryMethod.leftAtAgreedLocation,
            accent: "neutral"
        }
    };
}
