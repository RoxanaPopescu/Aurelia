import { ListViewDefinition } from "../list-view-definition";
import { RouteListViewColumn } from "./route-list-view-column";
import { RouteListViewFilter } from "./route-list-view-filter";

/**
 * Represents the definition of a list view presenting items of type `RouteInfo`.
 */
export class RouteListViewDefinition extends ListViewDefinition<RouteListViewFilter>
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
            this.filter = new RouteListViewFilter(data.filter);
            this.columns = data.columns.map((column: any) => new RouteListViewColumn(column.slug, column.width));
            this.sorting = data.sorting;
        }
        else
        {
            this.shared = false;
            this.filter = new RouteListViewFilter();
            this.columns =
            [
                new RouteListViewColumn("slug"),
                new RouteListViewColumn("reference"),
                new RouteListViewColumn("start-date"),
                new RouteListViewColumn("start-address"),
                new RouteListViewColumn("tags"),
                new RouteListViewColumn("stop-count"),
                new RouteListViewColumn("vehicle-type"),
                new RouteListViewColumn("status"),
                new RouteListViewColumn("driving-list")
            ];
            this.sorting =
            {
                property: "start-date",
                direction: "descending"
            };
        }
    }

    /**
     * The type of the list view.
     */
    public type: "route" = "route";
}
