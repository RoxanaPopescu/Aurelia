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
            this.columns = data.columns.map((column: any) => new RouteListViewColumn(column));
        }
        else
        {
            this.filter = new RouteListViewFilter();
            this.columns =
            [
                new RouteListViewColumn({ slug: "slug" }),
                new RouteListViewColumn({ slug: "reference" }),
                new RouteListViewColumn({ slug: "start-date" }),
                new RouteListViewColumn({ slug: "start-address" }),
                new RouteListViewColumn({ slug: "tags" }),
                new RouteListViewColumn({ slug: "stop-count" }),
                new RouteListViewColumn({ slug: "vehicle-type" }),
                new RouteListViewColumn({ slug: "status" }),
                new RouteListViewColumn({ slug: "driving-list" })
            ];
        }
    }
}
