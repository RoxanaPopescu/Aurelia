import { Accent } from "app/model/entities/shared";

/**
 * Represents the slug identifying a `OrderStatus`.
 */
export type OrderStatusSlug = keyof typeof OrderStatus.map;

/**
 * Represents the status of an order.
 */
export class OrderStatus
{
    public constructor(slug: keyof typeof OrderStatus.map)
    {
        this.slug = slug;
        Object.assign(this, OrderStatus.map[slug]);
    }

    public slug: keyof typeof OrderStatus.map;
    public name: string;
    public accent: Accent;
    public value: number;

    public static readonly map =
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
            accent: "negative",
            value: 4
        },
        "cancelled":
        {
            name: "Cancelled",
            accent: "negative",
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
