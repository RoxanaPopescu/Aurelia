import { DateTime, Duration } from "luxon";
import { observable } from "aurelia-framework";
import { Position, Address } from "app/model/shared";
import { VehicleType } from "app/model/vehicle";
import { RouteStatusSlug } from "../../../route";
import { IListViewFilter } from "../list-view-filter";

/**
 * Represents a filter for a list view presenting items of type `RouteInfo`.
 */
export class RouteListViewFilter implements IListViewFilter
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.textFilter = data.filters.textFilter;
            this.statusFilter = data.filters.statusFilter;
            this.assignedDriver = data.filters.assignedDriver;
            this.notAssignedDriver = data.filters.notAssignedDriver;
            this.assignedVehicle = data.filters.assignedVehicle;
            this.notAssignedVehicle = data.filters.notAssignedVehicle;
            this.startTimeFromFilter = data.filters.startTimeFromFilter != null
                ? DateTime.fromISO(data.filters.startTimeFromFilter, { setZone: true })
                : undefined;
            this.startTimeToFilter = data.filters.startTimeToFilter != null
                ? DateTime.fromISO(data.filters.startTimeToFilter, { setZone: true })
                : undefined;
            this.relativeStartTimeFromFilterUnit = data.filters.relativeStartTimeFromFilterUnit;
            this.relativeStartTimeToFilterUnit = data.filters.relativeStartTimeToFilterUnit;
            this.tagsFilter = data.filters.tagsFilter;
            this.orderedVehicleTypesFilter = data.filters.orderedVehicleTypesFilter?.map(slug => VehicleType.getBySlug(slug));
            this.legacyOwnerIdsFilter = data.filters.legacyOwnerIdsFilter;
            this.createdTimeFromFilter = data.filters.createdTimeFromFilter != null
                ? DateTime.fromISO(data.filters.createdTimeFromFilter, { setZone: true })
                : undefined;
            this.createdTimeToFilter = data.filters.createdTimeToFilter != null
                ? DateTime.fromISO(data.filters.createdTimeToFilter, { setZone: true })
                : undefined;
            this.useRelativeStartTimeFromFilter = data.filters.relativeStartTimeFromFilter != null;
            this.relativeStartTimeFromFilter = data.filters
                .relativeStartTimeFromFilter
                ? Duration.fromISO(data.filters.relativeStartTimeFromFilter)
                : undefined;
            this.useRelativeStartTimeToFilter = data.filters.relativeStartTimeToFilter != null;
            this.relativeStartTimeToFilter = data.filters.relativeStartTimeToFilter
                ? Duration.fromISO(data.filters.relativeStartTimeToFilter)
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
    @observable({ changeHandler: "updateRelative" })
    public useRelativeStartTimeFromFilter = false;

    /**
     * The min relative time for which routes should be shown.
     */
    @observable({ changeHandler: "updateRelative" })
    public relativeStartTimeFromFilter: Duration | undefined;

    /**
     * The unit in which `relativeStartTimeFromFilter` is specified.
     */
    @observable({ changeHandler: "updateRelative" })
    public relativeStartTimeFromFilterUnit: "days" | "hours" | undefined;

    /**
     * True to use `relativeStartTimeToFilter`, otherwise false.
     */
    @observable({ changeHandler: "updateRelative" })
    public useRelativeStartTimeToFilter = false;

    /**
     * The max relative time for which routes should be shown.
     */
    @observable({ changeHandler: "updateRelative" })
    public relativeStartTimeToFilter: Duration | undefined;

    /**
     * The unit in which `relativeStartTimeToFilter` is specified.
     */
    @observable({ changeHandler: "updateRelative" })
    public relativeStartTimeToFilterUnit: "days" | "hours" | undefined;

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
     * Called by the framework when a property changes.
     */
    protected update(newValue?: any, oldValue?: any, propertyName?: string): void
    {
        // TODO
    }
}
