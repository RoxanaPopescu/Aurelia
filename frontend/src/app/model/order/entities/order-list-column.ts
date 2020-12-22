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
    public columSize: string;
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
            columSize: "1.2fr",
            column: "visible"
        },
        "tags":
        {
            name: "Tags",
            columSize: "1.2fr",
            column: "visible"
        },
        "pickup-date":
        {
            name: "Pickup date",
            columSize: "1fr",
            sortingName: "pickup-date",
            column: "visible"
        },
        "pickup-time":
        {
            name: "Pickup timeframe",
            columSize: "1fr",
            sortingName: "pickup-time",
            column: "visible"
        },
        "pickup-address":
        {
            name: "Pickup address",
            columSize: "1fr",
            sortingName: "pickup-address",
            column: "visible"
        },
        "delivery-address":
        {
            name: "Delivery address",
            columSize: "1fr",
            sortingName: "delivery-address",
            column: "visible"
        },
        "status":
        {
            name: "Status",
            columSize: "min-content",
            sortingName: "status",
            column: "visible"
        }
    };
}
