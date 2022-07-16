import { RouteListViewColumn } from "./route-list-view-column";
import { RouteListViewFilter } from "./route-list-view-filter";
import { ListViewDefinition } from "../list-view-definition";

/**
 * Represents the definition of a list view presenting items of type `RouteInfo`.
 */
export class RouteListViewDefinition extends ListViewDefinition<RouteListViewFilter>
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        super(data);

        if (data != null)
        {
            this.filter = new RouteListViewFilter(data.filter);
            this.columns = data.columns.map((column: any) => new RouteListViewColumn(column.slug, column.width));
        }
        else
        {
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
        }
    }
}
