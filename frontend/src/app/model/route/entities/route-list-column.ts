import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `RouteStopType`.
 */
export type RouteListColumnSlug = keyof typeof RouteListColumn.values;

/**
 * Represents the type of a route stop.
 */
export class RouteListColumn
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the type of the route stop.
     */
    public constructor(slug: RouteListColumnSlug)
    {
        this.slug = slug ? textCase(slug, "pascal", "kebab") as any : "slug";
        Object.assign(this, RouteListColumn.values[this.slug]);
    }

    public slug: RouteListColumnSlug;
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
            sortingName: "slug",
            column: "visible"
        },
        "reference":
        {
            name: "Reference",
            columnSize: "1.2fr",
            sortingName: "reference",
            column: "visible"
        },
        "owner":
        {
            name: "Owner",
            columnSize: "1fr",
            column: "visible"
        },
        "start-date":
        {
            name: "Start date",
            columnSize: "1fr",
            sortingName: "start-date",
            column: "visible"
        },
        "start-address":
        {
            name: "Start address",
            columnSize: "1.3fr",
            sortingName: "start-address",
            column: "visible"
        },
        "end-date":
        {
            name: "End date",
            columnSize: "1fr",
            sortingName: "end-date",
            column: "visible"
        },
        "end-address":
        {
            name: "End address",
            columnSize: "1.3fr",
            sortingName: "end-address",
            column: "visible"
        },
        "tags":
        {
            name: "Tags",
            columnSize: "1.3fr",
            column: "visible"
        },
        "stop-count":
        {
            name: "Stop count",
            columnSize: "min-content",
            sortingName: "stops",
            column: "visible"
        },
        "vehicle-type":
        {
            name: "Vehicle type",
            columnSize: "min-content",
            column: "visible"
        },
        "vehicle":
        {
            name: "Vehicle",
            columnSize: "1fr",
            column: "visible"
        },
        "driver":
        {
            name: "Driver",
            columnSize: "1fr",
            column: "visible"
        },
        "fulfiller":
        {
            name: "Fulfiller",
            columnSize: "1fr",
            column: "visible"
        },
        "complexity":
        {
            name: "Complexity",
            columnSize: "min-content",
            column: "visible"
        },
        "status":
        {
            name: "Status",
            columnSize: "min-content",
            sortingName: "status",
            column: "visible"
        },
        "legacy-id":
        {
            name: "Legacy id",
            columnSize: "min-content",
            column: "visible"
        },
        "driver-list":
        {
            name: "Driver list",
            columnSize: "min-content",
            column: "hidden"
        },
        "delayed-stops":
        {
            name: "Delayed stops",
            columnSize: "min-content",
            column: "visible"
        },
        "estimated-completion":
        {
            name: "Est. completed",
            columnSize: "min-content",
            column: "visible"
        },
        "planned-time-frame":
        {
            name: "Planned time",
            columnSize: "min-content",
            column: "visible"
        },
        "criticality":
        {
            name: "Criticality",
            columnSize: "min-content",
            column: "not-added"
        }
    };
}
