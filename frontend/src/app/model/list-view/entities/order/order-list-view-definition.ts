import { ListViewDefinition } from "../list-view-definition";
import { OrderListViewColumn } from "./order-list-view-column";
import { OrderListViewFilter } from "./order-list-view-filter";

/**
 * Represents the definition of a list view presenting items of type `OrderInfo`.
 */
export class OrderListViewDefinition extends ListViewDefinition<OrderListViewFilter>
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created, or undefined to create a new instance.
     */
    public constructor(data?: any)
    {
        super(data);

        if (data != null)
        {
            this.shared = data.shared;
            this.filter = new OrderListViewFilter(data.filter);
            this.columns = data.columns.map((column: any) => new OrderListViewColumn(column.slug, column.width));
            this.sorting = data.sorting;
        }
        else
        {
            this.shared = false;
            this.filter = new OrderListViewFilter();
            this.columns =
            [
                new OrderListViewColumn("slug"),
                new OrderListViewColumn("tags"),
                new OrderListViewColumn("pickup-date"),
                new OrderListViewColumn("pickup-time"),
                new OrderListViewColumn("pickup-address"),
                new OrderListViewColumn("delivery-address"),
                new OrderListViewColumn("status")
            ];
            this.sorting =
            {
                property: "pickup-date",
                direction: "descending"
            };
        }
    }

    /**
     * The type of the list view.
     */
    public type: "order" = "order";
}
