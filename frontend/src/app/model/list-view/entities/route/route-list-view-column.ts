import { ListViewColumn } from "../list-view-column";
import listColumn from "./resources/strings/route-list-view-columns.json";

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
     * @param slug The slug identifying the column.
     * @param width The width of he column, or undefined to use the default.
     */
    public constructor(slug: RouteListViewColumnSlug, width?: string)
    {
        super(RouteListViewColumn.values, slug, width);
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
            width: "60fr",
            property: "slug",
            visibility: "visible"
        },
        "reference":
        {
            name: listColumn.reference,
            shortName: listColumn.reference,
            width: "60fr",
            property: "reference",
            visibility: "visible"
        },
        "owner":
        {
            name: listColumn.owner,
            shortName: listColumn.owner,
            width: "50fr",
            property: "owner",
            visibility: "visible"
        },
        "start-date":
        {
            name: listColumn.startDate,
            shortName: listColumn.startDate,
            width: "50fr",
            property: "planned-time-start",
            visibility: "visible"
        },
        "start-address":
        {
            name: listColumn.startAddress,
            shortName: listColumn.startAddress,
            width: "65fr",
            property: "start-address",
            visibility: "visible"
        },
        "end-date":
        {
            name: listColumn.endDate,
            shortName: listColumn.endDate,
            width: "50fr",
            property: "planned-time-end",
            visibility: "visible"
        },
        "end-address":
        {
            name: listColumn.endAddress,
            shortName: listColumn.endAddress,
            width: "65fr",
            property: "end-address",
            visibility: "visible"
        },
        "tags":
        {
            name: listColumn.tags,
            shortName: listColumn.tags,
            width: "65fr",
            property: undefined,
            visibility: "visible"
        },
        "stop-count":
        {
            name: listColumn.stopCount,
            shortName: listColumn.stopCountShort,
            width: "min-content",
            property: "stop-count",
            visibility: "visible"
        },
        "vehicle-type-dispatched":
        {
            name: listColumn.vehicleTypeDispatched,
            shortName: listColumn.vehicleTypeDispatchedShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "vehicle-type":
        {
            name: listColumn.vehicleType,
            shortName: listColumn.vehicleType,
            width: "min-content",
            property: "vehicle-type",
            visibility: "visible"
        },
        "vehicle":
        {
            name: listColumn.vehicle,
            shortName: listColumn.vehicle,
            width: "50fr",
            property: undefined,
            visibility: "visible"
        },
        "driver":
        {
            name: listColumn.driver,
            shortName: listColumn.driver,
            width: "50fr",
            property: undefined,
            visibility: "visible"
        },
        "driver-id":
        {
            name: listColumn.driverId,
            shortName: listColumn.driverId,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "driver-telephone-number":
        {
            name: listColumn.driverTelephoneNumber,
            shortName: listColumn.driverTelephoneNumberShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "executor":
        {
            name: listColumn.executor,
            shortName: listColumn.executor,
            width: "50fr",
            property: undefined,
            visibility: "visible"
        },
        "complexity":
        {
            name: listColumn.complexity,
            shortName: listColumn.complexity,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "status":
        {
            name: listColumn.status,
            shortName: listColumn.status,
            width: "min-content",
            property: "status",
            visibility: "visible"
        },
        "legacy-id":
        {
            name: listColumn.legacyId,
            shortName: listColumn.legacyId,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "driving-list":
        {
            name: listColumn.drivingList,
            shortName: listColumn.drivingList,
            width: "min-content",
            property: undefined,
            visibility: "icon"
        },
        "delayed-stops":
        {
            name: listColumn.delayedStops,
            shortName: listColumn.delayedStops,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "estimated-time-frame":
        {
            name: listColumn.estimatedTime,
            shortName: listColumn.estimatedTimeShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "estimated-time-start":
        {
            name: listColumn.estimatedStartTime,
            shortName: listColumn.estimatedStartTimeShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "estimated-time-end":
        {
            name: listColumn.estimatedEndTime,
            shortName: listColumn.estimatedEndTimeShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "original-estimated-time-frame":
        {
            name: listColumn.originalEstimatedTime,
            shortName: listColumn.originalEstimatedTimeShort,
            width: "min-content",
            property: "original-estimate-start",
            visibility: "visible"
        },
        "original-estimated-start":
        {
            name: listColumn.originalEstimatedStartTime,
            shortName: listColumn.originalEstimatedStartTimeShort,
            width: "min-content",
            property: "original-estimate-start",
            visibility: "visible"
        },
        "original-estimated-end":
        {
            name: listColumn.originalEstimatedEndTime,
            shortName: listColumn.originalEstimatedEndTimeShort,
            width: "min-content",
            property: "original-estimate-end",
            visibility: "visible"
        },
        "planned-time-frame":
        {
            name: listColumn.plannedTime,
            shortName: listColumn.plannedTimeShort,
            width: "min-content",
            property: "planned-time-start",
            visibility: "visible"
        },
        "distance":
        {
            name: listColumn.distance,
            shortName: listColumn.distance,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "team":
        {
            name: listColumn.team,
            shortName: listColumn.team,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "colli-count":
        {
            name: listColumn.colliCount,
            shortName: listColumn.colliCountShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "estimated-colli-count":
        {
            name: listColumn.estimatedColliCount,
            shortName: listColumn.estimatedColliCountShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "stop-user-name":
        {
            name: listColumn.stopUserName,
            shortName: listColumn.stopUserName,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "stop-company-name":
        {
            name: listColumn.stopCompanyName,
            shortName: listColumn.stopCompanyNameShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "stop-user-telephone":
        {
            name: listColumn.stopUserTelephone,
            shortName: listColumn.stopUserTelephoneShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "stop-ready-date":
        {
            name: listColumn.stopEarlistArrivalDate,
            shortName: listColumn.stopEarlistArrivalDate,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "stop-ready-time":
        {
            name: listColumn.stopEarlistArrivalTime,
            shortName: listColumn.stopEarlistArrivalTime,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "stop-close-date":
        {
            name: listColumn.stopLatestArrivalDate,
            shortName: listColumn.stopLatestArrivalDate,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "stop-close-time":
        {
            name: listColumn.stopLatestArrivalTime,
            shortName: listColumn.stopLatestArrivalTime,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "route-creation-date":
        {
            name: listColumn.routeCreationDate,
            shortName: listColumn.routeCreationDateShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "route-creation-time":
        {
            name: listColumn.routeCreationTime,
            shortName: listColumn.routeCreationTimeShort,
            width: "min-content",
            property: undefined,
            visibility: "visible"
        },
        "unknown":
        {
            name: listColumn.unknown,
            shortName: listColumn.unknown,
            width: "0",
            property: undefined,
            visibility: "hidden"
        }
    };
}
