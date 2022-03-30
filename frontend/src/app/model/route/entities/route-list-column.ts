import { textCase } from "shared/utilities/text";
import { IColumn } from "app/modals/panels/select-columns/column";
import listColumn from "../resources/strings/route-list-columns.json";

/**
 * Represents the slug identifying a `RouteStopType`.
 */
export type RouteListColumnSlug = keyof typeof RouteListColumn.values;

/**
 * Represents the type of a route stop.
 */
export class RouteListColumn implements IColumn
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
    public width: string;
    public sortingName?: string;
    public hidden: boolean;

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
            width: "1.2fr",
            sortingName: "slug",
            hidden: false
        },
        "reference":
        {
            name: listColumn.reference,
            width: "1.2fr",
            sortingName: "reference",
            hidden: false
        },
        "owner":
        {
            name: listColumn.owner,
            width: "1fr",
            sortingName: "owner",
            hidden: false
        },
        "start-date":
        {
            name: listColumn.startDate,
            width: "1fr",
            sortingName: "planned-time-start",
            hidden: false
        },
        "start-address":
        {
            name: listColumn.startAddress,
            width: "1.3fr",
            sortingName: "start-address",
            hidden: false
        },
        "end-date":
        {
            name: listColumn.endDate,
            width: "1fr",
            sortingName: "planned-time-end",
            hidden: false
        },
        "end-address":
        {
            name: listColumn.endAddress,
            width: "1.3fr",
            sortingName: "end-address",
            hidden: false
        },
        "tags":
        {
            name: listColumn.tags,
            width: "1.3fr",
            hidden: false
        },
        "stop-count":
        {
            name: listColumn.stopCount,
            columnName: listColumn.stopCountShort,
            width: "min-content",
            sortingName: "stop-count",
            hidden: false
        },
        "vehicle-type":
        {
            name: listColumn.vehicleType,
            width: "min-content",
            sortingName: "vehicle-type",
            hidden: false
        },
        "vehicle":
        {
            name: listColumn.vehicle,
            width: "1fr",
            hidden: false
        },
        "driver":
        {
            name: listColumn.driver,
            width: "1fr",
            hidden: false
        },
        "driver-id":
        {
            name: listColumn.driverId,
            width: "min-content",
            hidden: false
        },
        "executor":
        {
            name: listColumn.executor,
            width: "1fr",
            hidden: false
        },
        "complexity":
        {
            name: listColumn.complexity,
            width: "min-content",
            hidden: false
        },
        "status":
        {
            name: listColumn.status,
            width: "min-content",
            sortingName: "status",
            hidden: false
        },
        "legacy-id":
        {
            name: listColumn.legacyId,
            width: "min-content",
            hidden: false
        },
        "driving-list":
        {
            name: listColumn.drivingList,
            width: "min-content",
            hidden: true
        },
        "delayed-stops":
        {
            name: listColumn.delayedStops,
            width: "min-content",
            hidden: false
        },
        "estimated-time-frame":
        {
            name: listColumn.estimatedTime,
            columnName: listColumn.estimatedTimeShort,
            width: "min-content",
            hidden: false
        },
        "estimated-time-start":
        {
            name: listColumn.estimatedStartTime,
            columnName: listColumn.estimatedStartTimeShort,
            width: "min-content",
            hidden: false
        },
        "estimated-time-end":
        {
            name: listColumn.estimatedEndTime,
            columnName: listColumn.estimatedEndTimeShort,
            width: "min-content",
            hidden: false
        },
        "original-estimated-time-frame":
        {
            name: listColumn.originalEstimatedTime,
            columnName: listColumn.originalEstimatedTimeShort,
            width: "min-content",
            sortingName: "original-estimate-start",
            hidden: false
        },
        "original-estimated-start":
        {
            name: listColumn.originalEstimatedStartTime,
            columnName: listColumn.originalEstimatedStartTimeShort,
            width: "min-content",
            sortingName: "original-estimate-start",
            hidden: false
        },
        "original-estimated-end":
        {
            name: listColumn.originalEstimatedEndTime,
            columnName: listColumn.originalEstimatedEndTimeShort,
            width: "min-content",
            sortingName: "original-estimate-end",
            hidden: false
        },
        "planned-time-frame":
        {
            name: listColumn.plannedTime,
            columnName: listColumn.plannedTimeShort,
            width: "min-content",
            sortingName: "planned-time-start",
            hidden: false
        },
        "distance":
        {
            name: listColumn.distance,
            width: "min-content",
            hidden: false
        },
        "team":
        {
            name: listColumn.team,
            width: "min-content",
            hidden: false
        },
        "colli-count":
        {
            name: listColumn.colliCount,
            columnName: listColumn.colliCountShort,
            width: "min-content",
            hidden: false
        },
        "estimated-colli-count":
        {
            name: listColumn.estimatedColliCount,
            columnName: listColumn.estimatedColliCountShort,
            width: "min-content",
            hidden: false
        }
    };
}
