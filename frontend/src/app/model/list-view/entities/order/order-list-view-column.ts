import { ListViewColumn } from "../list-view-column";
import listColumn from "./resources/strings/order-list-view-columns.json";

/**
 * Represents the slug identifying a `OrderListViewColumn`.
 */
export type OrderListViewColumnSlug = keyof typeof OrderListViewColumn.values;

/**
 * Represents a column in a list view presenting items of type `OrderInfo`.
 */
export class OrderListViewColumn extends ListViewColumn<OrderListViewColumnSlug>
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the column.
     * @param width The width of he column, or undefined to use the default.
     */
    public constructor(slug: OrderListViewColumnSlug, width?: string)
    {
        super(OrderListViewColumn.values, slug, width);
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "slug":
        {
            name: listColumn.id,
            shortName: listColumn.id,
            width: "60fr",
            property: "slug",
            visibility: "visible"
        },
        "tags":
        {
            name: listColumn.tags,
            shortName: listColumn.tags,
            width: "60fr",
            visibility: "visible"
        },
        "pickup-date":
        {
            name: listColumn.pickupDate,
            shortName: listColumn.pickupDate,
            width: "50fr",
            property: "pickup-date",
            visibility: "visible"
        },
        "pickup-time":
        {
            name: listColumn.pickupTimeframe,
            shortName: listColumn.pickupTimeframe,
            width: "50fr",
            property: "pickup-time",
            visibility: "visible"
        },
        "pickup-address":
        {
            name: listColumn.pickupAddress,
            shortName: listColumn.pickupAddress,
            width: "50fr",
            property: "pickup-address",
            visibility: "visible"
        },
        "delivery-date":
        {
            name: listColumn.deliveryDate,
            shortName: listColumn.deliveryDate,
            width: "50fr",
            property: "delivery-date",
            visibility: "visible"
        },
        "delivery-time":
        {
            name: listColumn.deliveryTimeframe,
            shortName: listColumn.deliveryTimeframe,
            width: "50fr",
            property: "delivery-time",
            visibility: "visible"
        },
        "delivery-address":
        {
            name: listColumn.deliveryAddress,
            shortName: listColumn.deliveryAddress,
            width: "50fr",
            property: "delivery-address",
            visibility: "visible"
        },
        "status":
        {
            name: listColumn.status,
            shortName: listColumn.status,
            width: "40fr",
            property: "status",
            visibility: "visible"
        },
        "relational-id":
        {
            name: listColumn.RelationalId,
            shortName: listColumn.RelationalId,
            width: "60fr",
            visibility: "visible"
        },
        "colli-count":
        {
            name: listColumn.colliCount,
            shortName: listColumn.colliCountShort,
            width: "min-content",
            property: "colli-count",
            visibility: "visible"
        },
        "colli-total-weight":
        {
            name: listColumn.colliTotalWeight,
            shortName: listColumn.colliTotalWeightShort,
            width: "50fr",
            visibility: "visible"
        },
        "colli-total-volume":
        {
            name: listColumn.colliTotalVolume,
            shortName: listColumn.colliTotalVolumeShort,
            width: "50fr",
            visibility: "visible"
        },
        "estimated-colli-count":
        {
            name: listColumn.estimatedColliCount,
            shortName: listColumn.estimatedColliCountShort,
            width: "min-content",
            property: "estimated-colli-count",
            visibility: "visible"
        },
        "estimated-colli-total-weight":
        {
            name: listColumn.estimatedColliTotalWeight,
            shortName: listColumn.estimatedColliTotalWeightShort,
            width: "50fr",
            visibility: "visible"
        },
        "estimated-colli-total-volume":
        {
            name: listColumn.estimatedColliTotalVolume,
            shortName: listColumn.estimatedColliTotalVolumeShort,
            width: "50fr",
            visibility: "visible"
        },
        "unknown":
        {
            name: listColumn.unknown,
            shortName: listColumn.unknown,
            width: "0",
            property: undefined,
            visibility: "hidden"
        }
    };
}
