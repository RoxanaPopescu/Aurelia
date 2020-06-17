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
    public hideColumn: boolean;
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
            hideColumn: false
        },
        "reference":
        {
            name: "Reference",
            columSize: "1.2fr",
            sortingName: "reference",
            hideColumn: false
        },
        "owner":
        {
            name: "Owner",
            columSize: "1fr",
            hideColumn: false
        },
        "start-date":
        {
            name: "Start date",
            columSize: "1fr",
            sortingName: "start-date",
            hideColumn: false
        },
        "start-address":
        {
            name: "Start address",
            columSize: "1.3fr",
            sortingName: "start-address",
            hideColumn: false
        },
        "end-date":
        {
            name: "End date",
            columSize: "1fr",
            sortingName: "end-date",
            hideColumn: false
        },
        "end-address":
        {
            name: "End address",
            columSize: "1.3fr",
            sortingName: "end-address",
            hideColumn: false
        },
        "tags": {
            name: "Tags",
            columSize: "1.3fr",
            hideColumn: false
        },
        "stop-count": {
            name: "Stop count",
            columSize: "min-content",
            sortingName: "stops",
            hideColumn: false
        },
        "vehicle-type": {
            name: "Vehicle type",
            columSize: "min-content",
            hideColumn: false
        },
        "vehicle": {
            name: "Vehicle",
            columSize: "1fr",
            hideColumn: false
        },
        "driver": {
            name: "Driver",
            columSize: "1fr",
            hideColumn: false
        },
        "fulfiller": {
            name: "Fulfiller",
            columSize: "1fr",
            hideColumn: false
        },
        "complexity": {
            name: "Complexity",
            columSize: "min-content",
            hideColumn: false
        },
        "status": {
            name: "Status",
            columSize: "min-content",
            sortingName: "status",
            hideColumn: false
        },
        "legacy-id": {
            name: "Legacy id",
            columSize: "min-content",
            hideColumn: false
        },
        "driver-list": {
            name: "Driver list",
            columSize: "min-content",
            hideColumn: true
        }
    };
}
