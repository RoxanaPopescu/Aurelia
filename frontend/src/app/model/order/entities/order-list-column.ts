import { textCase } from "shared/utilities/text";

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
    public column: "hidden" | "visible" | "not-added";
    public columnSize: string;
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
            name: "Id",
            columnSize: "1.2fr",
            column: "visible"
        },
        "tags":
        {
            name: "Tags",
            columnSize: "1.2fr",
            column: "visible"
        },
        "pickup-date":
        {
            name: "Pickup date",
            columnSize: "1fr",
            sortingName: "pickup-date",
            column: "visible"
        },
        "pickup-time":
        {
            name: "Pickup timeframe",
            columnSize: "1fr",
            sortingName: "pickup-time",
            column: "visible"
        },
        "pickup-address":
        {
            name: "Pickup address",
            columnSize: "1fr",
            sortingName: "pickup-address",
            column: "visible"
        },
        "delivery-address":
        {
            name: "Delivery address",
            columnSize: "1fr",
            sortingName: "delivery-address",
            column: "visible"
        },
        "status":
        {
            name: "Status",
            columnSize: "min-content",
            sortingName: "status",
            column: "visible"
        },
        "relational-id":
        {
            name: "Relational id",
            columnSize: "1.2fr",
            column: "visible"
        },
        "colli-count":
        {
            name: "Colli count",
            columName: "Colli",
            columnSize: "min-content",
            column: "visible"
        },
        "colli-total-weight":
        {
            name: "Colli total weight",
            columName: "Total weight",
            columnSize: "1.0fr",
            column: "visible"
        },
        "colli-total-volume":
        {
            name: "Colli total volume",
            columName: "Total volume",
            columnSize: "1.0fr",
            column: "visible"
        },
        "estimated-colli-count":
        {
            name: "Estimated colli count",
            columName: "Estimated colli",
            columnSize: "min-content",
            column: "visible"
        },
        "estimated-colli-total-weight":
        {
            name: "Estimated colli total weight",
            columName: "Est. total weight",
            columnSize: "1.0fr",
            column: "visible"
        },
        "estimated-colli-total-volume":
        {
            name: "Estimated colli total volume",
            columName: "Est. Total volume",
            columnSize: "1.0fr",
            column: "visible"
        }
    };
}
