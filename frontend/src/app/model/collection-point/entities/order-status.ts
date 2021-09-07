import { textCase } from "shared/utilities";
import names from "../resources/strings/order-status-names.json";

/**
 * Represents the slug identifying a `OrderStatus`.
 */
export type OrderStatusSlug = keyof typeof OrderStatus.values;

/**
 * Represents the method by which a collo was scanned.
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
        "ready-for-collection":
        {
            name: names.readyForCollection
        },
        "collected":
        {
            name: names.collected
        },
        "missing":
        {
            name: names.missing
        },
        "damaged":
        {
            name: names.damaged
        },
        "not-collected":
        {
            name: names["not-collected"]
        },
        "rejected":
        {
            name: names.rejected
        }
    };
}
