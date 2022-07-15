import { ISorting } from "shared/types";
import { ListViewType } from "./list-view-type";
import { IListViewFilter } from "./list-view-filter";
import { IListViewColumn } from "./list-view-column";
import { RouteListViewColumn } from "./route-list-view-column";
import { RouteListViewFilter } from "./route-list-view-filter";

/**
 * Represents the definition of a list view.
 */
export class ListViewDefinition<TFilter extends IListViewFilter>
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.type = data.type;
            this.name = data.name;
            this.shared = data.shared;
            this.sorting = data.sorting;

            switch (this.type)
            {
                case "route":
                {
                    this.filter = new RouteListViewFilter(data.filter) as any;
                    this.columns = data.columns.map((column: any) => new RouteListViewColumn(column));

                    break;
                }

                default: throw new Error("Unknown list view type.");
            }
        }
        else
        {
            this.id = data.id;
            this.type = data.type;
            this.name = data.name;
            this.shared = data.shared;
            this.sorting = data.sorting;

            switch (this.type)
            {
                case "route":
                {
                    this.filter = new RouteListViewFilter() as any;
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

                    break;
                }

                default: throw new Error("Unknown list view type.");
            }
        }
    }

    /**
     * The ID of the list view.
     */
    public id: string;

    /**
     * The type of the list view.
     */
    public type: ListViewType;

    /**
     * The name of the list view.
     */
    public name: string;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    public shared: boolean;

    /**
     * The sorting to use for the table.
     */
    public sorting: ISorting;

    /**
     * The filter model.
     */
    public filter: TFilter;

    /**
     * The columns to be shown.
     */
    public columns: IListViewColumn[];

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            shared: this.shared,
            sorting: this.sorting,
            filters: this.filter.toJSON(),
            columns: this.columns.map(column => column.toJSON())
        };
    }
}
