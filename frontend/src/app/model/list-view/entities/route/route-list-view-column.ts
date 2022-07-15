import { ListViewColumn } from "../list-view-column";
import listColumn from "../../resources/strings/route-list-columns.json";

/**
 * Represents the slug identifying a `RouteListViewColumn`.
 */
export type RouteListViewColumnSlug = keyof typeof RouteListViewColumn.values;

/**
 * Represents a column in a list view presenting items of type `RouteInfo`.
 */
export class RouteListViewColumn extends ListViewColumn<RouteListViewColumnSlug>
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: { slug: RouteListViewColumnSlug, width?: string })
    {
        super(RouteListViewColumn.values, data);
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "slug":
        {
            name: listColumn.id,
            shortName: listColumn.id,
            width: "1.2fr",
            property: "slug",
            hidden: false
        },
        "reference":
        {
            name: listColumn.reference,
            shortName: listColumn.reference,
            width: "1.2fr",
            property: "reference",
            hidden: false
        },
        "owner":
        {
            name: listColumn.owner,
            shortName: listColumn.owner,
            width: "1fr",
            property: "owner",
            hidden: false
        },
        "start-date":
        {
            name: listColumn.startDate,
            shortName: listColumn.startDate,
            width: "1fr",
            property: "planned-time-start",
            hidden: false
        },
        "start-address":
        {
            name: listColumn.startAddress,
            shortName: listColumn.startAddress,
            width: "1.3fr",
            property: "start-address",
            hidden: false
        },
        "end-date":
        {
            name: listColumn.endDate,
            shortName: listColumn.endDate,
            width: "1fr",
            property: "planned-time-end",
            hidden: false
        },
        "end-address":
        {
            name: listColumn.endAddress,
            shortName: listColumn.endAddress,
            width: "1.3fr",
            property: "end-address",
            hidden: false
        },
        "tags":
        {
            name: listColumn.tags,
            shortName: listColumn.tags,
            width: "1.3fr",
            property: undefined,
            hidden: false
        },
        "stop-count":
        {
            name: listColumn.stopCount,
            shortName: listColumn.stopCountShort,
            width: "min-content",
            property: "stop-count",
            hidden: false
        },
        "vehicle-type":
        {
            name: listColumn.vehicleType,
            shortName: listColumn.vehicleType,
            width: "min-content",
            property: "vehicle-type",
            hidden: false
        },
        "vehicle":
        {
            name: listColumn.vehicle,
            shortName: listColumn.vehicle,
            width: "1fr",
            property: undefined,
            hidden: false
        },
        "driver":
        {
            name: listColumn.driver,
            shortName: listColumn.driver,
            width: "1fr",
            property: undefined,
            hidden: false
        },
        "driver-id":
        {
            name: listColumn.driverId,
            shortName: listColumn.driverId,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "executor":
        {
            name: listColumn.executor,
            shortName: listColumn.executor,
            width: "1fr",
            property: undefined,
            hidden: false
        },
        "complexity":
        {
            name: listColumn.complexity,
            shortName: listColumn.complexity,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "status":
        {
            name: listColumn.status,
            shortName: listColumn.status,
            width: "min-content",
            property: "status",
            hidden: false
        },
        "legacy-id":
        {
            name: listColumn.legacyId,
            shortName: listColumn.legacyId,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "driving-list":
        {
            name: listColumn.drivingList,
            shortName: listColumn.drivingList,
            width: "min-content",
            property: undefined,
            hidden: true
        },
        "delayed-stops":
        {
            name: listColumn.delayedStops,
            shortName: listColumn.delayedStops,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "estimated-time-frame":
        {
            name: listColumn.estimatedTime,
            shortName: listColumn.estimatedTimeShort,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "estimated-time-start":
        {
            name: listColumn.estimatedStartTime,
            shortName: listColumn.estimatedStartTimeShort,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "estimated-time-end":
        {
            name: listColumn.estimatedEndTime,
            shortName: listColumn.estimatedEndTimeShort,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "original-estimated-time-frame":
        {
            name: listColumn.originalEstimatedTime,
            shortName: listColumn.originalEstimatedTimeShort,
            width: "min-content",
            property: "original-estimate-start",
            hidden: false
        },
        "original-estimated-start":
        {
            name: listColumn.originalEstimatedStartTime,
            shortName: listColumn.originalEstimatedStartTimeShort,
            width: "min-content",
            property: "original-estimate-start",
            hidden: false
        },
        "original-estimated-end":
        {
            name: listColumn.originalEstimatedEndTime,
            shortName: listColumn.originalEstimatedEndTimeShort,
            width: "min-content",
            property: "original-estimate-end",
            hidden: false
        },
        "planned-time-frame":
        {
            name: listColumn.plannedTime,
            shortName: listColumn.plannedTimeShort,
            width: "min-content",
            property: "planned-time-start",
            hidden: false
        },
        "distance":
        {
            name: listColumn.distance,
            shortName: listColumn.distance,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "team":
        {
            name: listColumn.team,
            shortName: listColumn.team,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "colli-count":
        {
            name: listColumn.colliCount,
            shortName: listColumn.colliCountShort,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "estimated-colli-count":
        {
            name: listColumn.estimatedColliCount,
            shortName: listColumn.estimatedColliCountShort,
            width: "min-content",
            property: undefined,
            hidden: false
        },
        "unknown":
        {
            name: listColumn.unknown,
            shortName: listColumn.unknown,
            width: "0",
            property: undefined,
            hidden: true
        }
    };
}
