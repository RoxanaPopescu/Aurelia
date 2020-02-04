import { textCase } from "shared/utilities";
import { Accent } from "app/model/shared";

/**
 * Represents the slug identifying a `OrderStatus`.
 */
export type OrderStatusSlug = keyof typeof OrderStatus.values;

/**
 * Represents the status of an order.
 */
export class OrderStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(slug: OrderStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, OrderStatus.values[this.slug]);
    }

    public slug: OrderStatusSlug;
    public name: string;
    public accent: Accent;
    public value: number;

    public static readonly values =
    {
        "placed":
        {
            name: "Placed",
            accent: "neutral",
            value: 1
        },
        "validated":
        {
            name: "Validated",
            accent: "neutral",
            value: 2
        },
        "ready":
        {
            name: "Ready",
            accent: "neutral",
            value: 3
        },
        "deleted":
        {
            name: "Deleted",
            accent: "neutral",
            value: 4
        },
        "cancelled":
        {
            name: "Cancelled",
            accent: "neutral",
            value: 5
        },
        "inRoutePlanning":
        {
            name: "Route planning",
            accent: "neutral",
            value: 6
        },
        "routePlanned":
        {
            name: "Route planned",
            accent: "neutral",
            value: 8
        },
        "delivered":
        {
            name: "Delivered",
            accent: "positive",
            value: 7
        }
    };
}
