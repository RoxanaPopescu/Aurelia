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
        this.slug = slug ? textCase(slug, "pascal", "kebab") as any : "pickup";
        Object.assign(this, RouteListColumn.values[this.slug]);
    }

    public slug: RouteListColumnSlug;
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
            sortingName: "slug",
            column: "visible"
        },
        "reference":
        {
            name: "Reference",
            columSize: "1.2fr",
            sortingName: "reference",
            column: "visible"
        },
        "owner":
        {
            name: "Owner",
            columSize: "1fr",
            column: "visible"
        },
        "start-date":
        {
            name: "Start date",
            columSize: "1fr",
            sortingName: "start-date",
            column: "visible"
        },
        "start-address":
        {
            name: "Start address",
            columSize: "1.3fr",
            sortingName: "start-address",
            column: "visible"
        },
        "end-date":
        {
            name: "End date",
            columSize: "1fr",
            sortingName: "end-date",
            column: "visible"
        },
        "end-address":
        {
            name: "End address",
            columSize: "1.3fr",
            sortingName: "end-address",
            column: "visible"
        },
        "tags": {
            name: "Tags",
            columSize: "1.3fr",
            column: "visible"
        },
        "stop-count": {
            name: "Stop count",
            columSize: "min-content",
            sortingName: "stops",
            column: "visible"
        },
        "vehicle-type": {
            name: "Vehicle type",
            columSize: "min-content",
            column: "visible"
        },
        "vehicle": {
            name: "Vehicle",
            columSize: "1fr",
            column: "visible"
        },
        "driver": {
            name: "Driver",
            columSize: "1fr",
            column: "visible"
        },
        "fulfiller": {
            name: "Fulfiller",
            columSize: "1fr",
            column: "visible"
        },
        "complexity": {
            name: "Complexity",
            columSize: "min-content",
            column: "visible"
        },
        "status": {
            name: "Status",
            columSize: "min-content",
            sortingName: "status",
            column: "visible"
        },
        "legacy-id": {
            name: "Legacy id",
            columSize: "min-content",
            column: "visible"
        },
        "driver-list": {
            name: "Driver list",
            columSize: "min-content",
            column: "hidden"
        },
        "delayed-stops": {
            name: "Delayed stops",
            columSize: "min-content",
            column: "visible"
        },
        "estimated-completion": {
            name: "Est. completed",
            columSize: "min-content",
            column: "visible"
        },
        "planned-time-frame": {
            name: "Planned time",
            columSize: "min-content",
            column: "visible"
        },
        "criticality": {
            name: "Criticality",
            columSize: "min-content",
            column: "not-added"
        }
    };
}
