import { textCase } from "shared/utilities/text";
import listColumn from "../resources/strings/route-list-columns.json";

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
            name: listColumn.id,
            columnSize: "1.2fr",
            sortingName: "slug",
            column: "visible"
        },
        "reference":
        {
            name: listColumn.reference,
            columnSize: "1.2fr",
            sortingName: "reference",
            column: "visible"
        },
        "owner":
        {
            name: listColumn.owner,
            columnSize: "1fr",
            column: "visible"
        },
        "start-date":
        {
            name: listColumn.startDate,
            columnSize: "1fr",
            sortingName: "start-date",
            column: "visible"
        },
        "start-address":
        {
            name: listColumn.startAddress,
            columnSize: "1.3fr",
            sortingName: "start-address",
            column: "visible"
        },
        "end-date":
        {
            name: listColumn.endDate,
            columnSize: "1fr",
            column: "visible"
        },
        "end-address":
        {
            name: listColumn.endAddress,
            columnSize: "1.3fr",
            column: "visible"
        },
        "tags":
        {
            name: listColumn.tags,
            columnSize: "1.3fr",
            column: "visible"
        },
        "stop-count":
        {
            name: listColumn.stopCount,
            columnName: "Stops",
            columnSize: "min-content",
            sortingName: "stop-count",
            column: "visible"
        },
        "vehicle-type":
        {
            name: listColumn.vehicleType,
            columnSize: "min-content",
            column: "visible"
        },
        "vehicle":
        {
            name: listColumn.vehicle,
            columnSize: "1fr",
            column: "visible"
        },
        "driver":
        {
            name: listColumn.driver,
            columnSize: "1fr",
            column: "visible"
        },
        "driver-id":
        {
            name: listColumn.driverId,
            columnSize: "1fr",
            column: "visible"
        },
        "executor":
        {
            name: listColumn.executor,
            columnSize: "1fr",
            column: "visible"
        },
        "complexity":
        {
            name: listColumn.complexity,
            columnSize: "min-content",
            column: "visible"
        },
        "status":
        {
            name: listColumn.status,
            columnSize: "min-content",
            sortingName: "status",
            column: "visible"
        },
        "legacy-id":
        {
            name: listColumn.legacyId,
            columnSize: "min-content",
            column: "visible"
        },
        "driving-list":
        {
            name: listColumn.drivingList,
            columnSize: "min-content",
            column: "hidden"
        },
        "delayed-stops":
        {
            name: listColumn.delayedStops,
            columnSize: "min-content",
            column: "visible"
        },
        "estimated-time-frame":
        {
            name: listColumn.estimatedTime,
            columnName: "Estimate",
            columnSize: "min-content",
            column: "visible"
        },
        "original-estimated-time-frame":
        {
            name: listColumn.originalEstimatedTime,
            columnName: "Original estimate",
            columnSize: "min-content",
            column: "visible"
        },
        "planned-time-frame":
        {
            name: listColumn.plannedTime,
            columnName: "Planned",
            columnSize: "min-content",
            column: "visible"
        },
        "planned-start-time-frame":
        {
            name: listColumn.plannedStartTime,
            columnName: "Starttime",
            columnSize: "min-content",
            column: "visible"
        },
        "criticality":
        {
            name: listColumn.criticality,
            columnSize: "min-content",
            column: "not-added"
        },
        "distance":
        {
            name: listColumn.distance,
            columnSize: "min-content",
            column: "visible"
        },
        "team":
        {
            name: listColumn.team,
            columnSize: "min-content",
            column: "visible"
        }
    };
}
