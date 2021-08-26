import { textCase } from "shared/utilities";
import { Accent } from "app/model/shared";
import orderStatus from "../resources/strings/order-status.json";

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
        "placed":
        {
            name: orderStatus.placed,
            accent: "neutral",
            value: 1
        },
        "validated":
        {
            name: orderStatus.validated,
            accent: "neutral",
            value: 2
        },
        "ready":
        {
            name: orderStatus.ready,
            accent: "neutral",
            value: 3
        },
        "deleted":
        {
            name: orderStatus.deleted,
            accent: "attention",
            value: 4
        },
        "cancelled":
        {
            name: orderStatus.cancelled,
            accent: "attention",
            value: 5
        },
        "in-route-planning":
        {
            name: orderStatus.routePlanning,
            accent: "neutral",
            value: 6
        },
        "route-planned":
        {
            name: orderStatus.routePlanned,
            accent: "neutral",
            value: 8
        },
        "delivered":
        {
            name: orderStatus.delivered,
            accent: "positive",
            value: 7
        }
    };
}
