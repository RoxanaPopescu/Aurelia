import { textCase } from "shared/utilities/text";
import listColumn from "../resources/strings/order-list-columns.json";

/**
 * Represents the slug identifying a `OrderListColumn`.
 */
export type OrderListColumnSlug = keyof typeof OrderListColumn.values;

/**
 * Represents the column of a order in the list.
 */
export class OrderListColumn
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the type of the order column.
     */
    public constructor(slug: OrderListColumnSlug)
    {
        this.slug = slug ? textCase(slug, "pascal", "kebab") as any : "slug";
        Object.assign(this, OrderListColumn.values[this.slug]);
    }

    public slug: OrderListColumnSlug;
    public name: string;
    public width: string;
    public sortingName?: string;

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
        "slug":
        {
            name: listColumn.id,
            width: "1.2fr",
            sortingName: "slug"
        },
        "tags":
        {
            name: listColumn.tags,
            width: "1.2fr"
        },
        "pickup-date":
        {
            name: listColumn.pickupDate,
            width: "1fr",
            sortingName: "pickup-date"
        },
        "pickup-time":
        {
            name: listColumn.pickupTimeframe,
            width: "1fr",
            sortingName: "pickup-time"
        },
        "pickup-address":
        {
            name: listColumn.pickupAddress,
            width: "1fr",
            sortingName: "pickup-address"
        },
        "delivery-date":
        {
            name: listColumn.deliveryDate,
            width: "1fr",
            sortingName: "delivery-date"
        },
        "delivery-time":
        {
            name: listColumn.deliveryTimeframe,
            width: "1fr",
            sortingName: "delivery-time"
        },
        "delivery-address":
        {
            name: listColumn.deliveryAddress,
            width: "1fr",
            sortingName: "delivery-address"
        },
        "status":
        {
            name: listColumn.status,
            width: "min-content",
            sortingName: "status"
        },
        "relational-id":
        {
            name: listColumn.RelationalId,
            width: "1.2fr"
        },
        "colli-count":
        {
            name: listColumn.colliCount,
            columnName: "Colli",
            width: "min-content",
            sortingName: "colli-count"
        },
        "colli-total-weight":
        {
            name: listColumn.colliTotalWeight,
            columnName: "Total weight",
            width: "1.0fr"
        },
        "colli-total-volume":
        {
            name: listColumn.colliTotalVolume,
            columnName: "Total volume",
            width: "1.0fr"
        },
        "estimated-colli-count":
        {
            name: listColumn.estimatedColliCount,
            columnName: "Est. colli",
            width: "min-content",
            sortingName: "estimated-colli-count"
        },
        "estimated-colli-total-weight":
        {
            name: listColumn.estimatedColliTotalWeight,
            columnName: "Est. total weight",
            width: "1.0fr"
        },
        "estimated-colli-total-volume":
        {
            name: listColumn.estimatedColliTotalVolume,
            columnName: "Est. Total volume",
            width: "1.0fr"
        }
    };
}
