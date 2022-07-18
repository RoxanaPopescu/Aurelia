import { DateTime, Duration } from "luxon";
import { observable } from "aurelia-framework";
import { Position, Address } from "app/model/shared";
import { VehicleType } from "app/model/vehicle";
import { RouteStatusSlug } from "../../../route";
import { ListViewFilter } from "../list-view-filter";

/**
 * Represents a filter for a list view presenting items of type `RouteInfo`.
 */
export class RouteListViewFilter extends ListViewFilter
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        super();

        if (data != null)
        {
            this.textFilter = data.textFilter;
            this.statusFilter = data.statusFilter;
            this.assignedDriver = data.assignedDriver;
            this.notAssignedDriver = data.notAssignedDriver;
            this.assignedVehicle = data.assignedVehicle;
            this.notAssignedVehicle = data.notAssignedVehicle;
            this.startTimeFromFilter = data.startTimeFromFilter != null
                ? DateTime.fromISO(data.startTimeFromFilter, { setZone: true })
                : undefined;
            this.startTimeToFilter = data.startTimeToFilter != null
                ? DateTime.fromISO(data.startTimeToFilter, { setZone: true })
                : undefined;
            this.relativeStartTimeFromFilterUnit = data.relativeStartTimeFromFilterUnit;
            this.relativeStartTimeToFilterUnit = data.relativeStartTimeToFilterUnit;
            this.tagsFilter = data.tagsFilter;
            this.orderedVehicleTypesFilter = data.orderedVehicleTypesFilter?.map(slug => VehicleType.getBySlug(slug));
            this.legacyOwnerIdsFilter = data.legacyOwnerIdsFilter;
            this.createdTimeFromFilter = data.createdTimeFromFilter != null
                ? DateTime.fromISO(data.createdTimeFromFilter, { setZone: true })
                : undefined;
            this.createdTimeToFilter = data.createdTimeToFilter != null
                ? DateTime.fromISO(data.createdTimeToFilter, { setZone: true })
                : undefined;
            this.useRelativeStartTimeFromFilter = data.relativeStartTimeFromFilter != null;
            this.relativeStartTimeFromFilter = data
                .relativeStartTimeFromFilter
                ? Duration.fromISO(data.relativeStartTimeFromFilter)
                : undefined;
            this.useRelativeStartTimeToFilter = data.relativeStartTimeToFilter != null;
            this.relativeStartTimeToFilter = data.relativeStartTimeToFilter
                ? Duration.fromISO(data.relativeStartTimeToFilter)
                : undefined;
            this.teamsFilter = data.teamsFilter;

            return;
        }
    }

    /**
     * The nearby pickup position.
     */
    public pickupNearbyPosition?: Position;

    /**
     * The nearby pickup address.
     */
    public pickupNearbyAddress?: Address;

    /**
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "update" })
    public statusFilter: RouteStatusSlug[] | undefined;

    /**
     * The text in the search text input.
     */
    @observable({ changeHandler: "update" })
    public textFilter: string | undefined;

    /**
     * True to show routes for which a driver is assigned.
     */
    @observable({ changeHandler: "update" })
    public assignedDriver: boolean = false;

    /**
     * True to show routes for which a driver is not assigned.
     */
    @observable({ changeHandler: "update" })
    public notAssignedDriver: boolean = false;

    /**
     * True to show routes for which a vehicle is assigned.
     */
    @observable({ changeHandler: "update" })
    public assignedVehicle: boolean = false;

    /**
     * True to show routes for which a vehicle is assigned.
     */
    @observable({ changeHandler: "update" })
    public notAssignedVehicle: boolean = false;

    /**
     * The vehicle types for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    public orderedVehicleTypesFilter: VehicleType[] | undefined;

    /**
     * The tags for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    public tagsFilter: any[] = [];

    /**
     * The min date for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    public startTimeFromFilter: DateTime | undefined;

    /**
     * The max date for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    public startTimeToFilter: DateTime | undefined;

    /**
     * True to use `relativeStartTimeFromFilter`, otherwise false.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public useRelativeStartTimeFromFilter = false;

    /**
     * The min relative time for which routes should be shown.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public relativeStartTimeFromFilter: Duration | undefined;

    /**
     * The unit in which `relativeStartTimeFromFilter` is specified.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public relativeStartTimeFromFilterUnit: "days" | "hours" | undefined = "hours";

    /**
     * True to use `relativeStartTimeToFilter`, otherwise false.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public useRelativeStartTimeToFilter = false;

    /**
     * The max relative time for which routes should be shown.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public relativeStartTimeToFilter: Duration | undefined;

    /**
     * The unit in which `relativeStartTimeToFilter` is specified.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public relativeStartTimeToFilterUnit: "days" | "hours" | undefined = "hours";

    /**
     * The min created date for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    public createdTimeFromFilter: DateTime | undefined;

    /**
     * The max created date for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    public createdTimeToFilter: DateTime | undefined;

    /**
     * The IDs of the teams for which data should be presented, or undefined if no team is selected.
     */
    @observable({ changeHandler: "update" })
    public teamsFilter: ("no-team" | string)[] | undefined;

    /**
     * The legacy owner IDs to show, only used by Mover Transport in a transition phase.
     */
    @observable({ changeHandler: "update" })
    public legacyOwnerIdsFilter: any[] | undefined;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            textFilter: this.textFilter,
            statusFilter: this.statusFilter,
            assignedDriver: this.assignedDriver,
            notAssignedDriver: this.notAssignedDriver,
            assignedVehicle: this.assignedVehicle,
            notAssignedVehicle: this.notAssignedVehicle,
            startTimeFromFilter: this.useRelativeStartTimeFromFilter
                ? undefined
                : this.startTimeFromFilter?.toISO(),
            startTimeToFilter: this.useRelativeStartTimeToFilter
                ? undefined
                : this.startTimeToFilter?.toISO(),
            relativeStartTimeFromFilter: this.relativeStartTimeFromFilter?.toISO(),
            relativeStartTimeToFilter: this.relativeStartTimeToFilter?.toISO(),
            relativeStartTimeFromFilterUnit: this.relativeStartTimeFromFilterUnit,
            relativeStartTimeToFilterUnit: this.relativeStartTimeToFilterUnit,
            tagsFilter: this.tagsFilter,
            orderedVehicleTypesFilter: this.orderedVehicleTypesFilter?.map(vt => vt.slug),
            legacyOwnerIdsFilter: this.legacyOwnerIdsFilter,
            createdTimeFromFilter: this.createdTimeFromFilter?.toISO(),
            createdTimeToFilter: this.createdTimeToFilter?.toISO(),
            teamsFilter: this.teamsFilter
        };
    }

    /**
     * Updates the state of teh relative start time filter.
     */
    protected updateRelativeStartTimeFilter(newValue: any, oldValue: any, propertyName: string): void
    {
        const now = DateTime.local();

        if (this.useRelativeStartTimeFromFilter && propertyName !== "relativeStartTimeFromFilterUnit")
        {
            const nowOrStartOfToday = this.relativeStartTimeFromFilterUnit === "days" ? now.startOf("day") : now;

            this.startTimeFromFilter = this.relativeStartTimeFromFilter != null ? nowOrStartOfToday.plus(this.relativeStartTimeFromFilter) : undefined;
        }
        else if (this.relativeStartTimeFromFilter != null)
        {
            this.relativeStartTimeFromFilter = undefined;
            this.startTimeFromFilter = undefined;
        }

        if (this.useRelativeStartTimeToFilter && propertyName !== "relativeStartTimeToFilterUnit")
        {
            const nowOrEndOfToday = this.relativeStartTimeToFilterUnit === "days" ? now.endOf("day") : now;

            this.startTimeToFilter = this.relativeStartTimeToFilter != null ? nowOrEndOfToday.plus(this.relativeStartTimeToFilter) : undefined;
        }
        else if (this.relativeStartTimeToFilter != null)
        {
            this.relativeStartTimeToFilter = undefined;
            this.startTimeToFilter = undefined;
        }
    }
}
