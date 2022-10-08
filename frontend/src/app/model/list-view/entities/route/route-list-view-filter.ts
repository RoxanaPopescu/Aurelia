import { DateTime, Duration } from "luxon";
import { Container, observable } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log, TemplateStringParser } from "shared/infrastructure";
import { AddressService } from "app/components/address-input/services/address-service/address-service";
import { Position, Address } from "app/model/shared";
import { VehicleType } from "app/model/vehicle";
import { RouteStatus, RouteStatusSlug } from "../../../route";
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
            this.relativeStartTimeFromFilterUnit = data.relativeStartTimeFromFilterUnit || "hours";
            this.relativeStartTimeToFilterUnit = data.relativeStartTimeToFilterUnit || "hours";
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
        }
    }

    /**
     * The most recent operation to update the pickup nearby position.
     */
    public pickupNearbyOperation: Operation;

    /**
     * The nearby pickup position.
     */
    @observable({ changeHandler: "update" })
    public pickupNearbyPosition?: Position;

    /**
     * The nearby pickup address.
     */
    @observable({ changeHandler: "pickupNearbyAddressChanged" })
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
    public tagsFilter: any[] | undefined;

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
     * Called from the `ListView` instance when the criteria should be updated.
     */
    public updateCriteria(): void
    {
        // tslint:disable: no-invalid-template-strings

        const parser = Container.instance.get(TemplateStringParser);

        const overrideContext =
        {
            startTimeFromOffset: this.relativeStartTimeFromFilter?.as(this.relativeStartTimeFromFilterUnit!),
            absStartTimeFromOffset: this.relativeStartTimeFromFilter != null ? Math.abs(this.relativeStartTimeFromFilter.as(this.relativeStartTimeFromFilterUnit!)) : undefined,
            startTimeToOffset: this.relativeStartTimeToFilter?.as(this.relativeStartTimeToFilterUnit!),
            absStartTimeToOffset: this.relativeStartTimeToFilter != null ? Math.abs(this.relativeStartTimeToFilter.as(this.relativeStartTimeToFilterUnit!)) : undefined
        };

        this.criteria =
        [
            // Status filter
            {
                slug: "status",
                name: "Status",
                description: "When this filter is applied, you will only see routes whose status matches one of the specified values",
                model:
                {
                    statusFilter: this.statusFilter
                },
                clear: () =>
                {
                    this.statusFilter = undefined;
                },
                summary: this.statusFilter?.map(s => RouteStatus.values[s].name)
            },

            // Start time filter
            {
                slug: "start-time",
                name: "Start time",
                description: "When this filter is applied, you will only see routes whose start date and time is within the specified range",
                model:
                {
                    startTimeFromFilter: this.startTimeFromFilter,
                    useRelativeStartTimeFromFilter: this.useRelativeStartTimeFromFilter,
                    relativeStartTimeFromFilterUnit: this.relativeStartTimeFromFilterUnit,
                    relativeStartTimeFromFilter: this.relativeStartTimeFromFilter,
                    startTimeToFilter: this.startTimeToFilter,
                    useRelativeStartTimeToFilter: this.useRelativeStartTimeToFilter,
                    relativeStartTimeToFilterUnit: this.relativeStartTimeToFilterUnit,
                    relativeStartTimeToFilter: this.relativeStartTimeToFilter
                },
                clear: () =>
                {
                    this.startTimeFromFilter = undefined;
                    this.useRelativeStartTimeFromFilter = false;
                    this.relativeStartTimeFromFilterUnit = "hours";
                    this.relativeStartTimeFromFilter = undefined;
                    this.startTimeToFilter = undefined;
                    this.useRelativeStartTimeToFilter = false;
                    this.relativeStartTimeToFilterUnit = "hours";
                    this.relativeStartTimeToFilter = undefined;
                },
                summary: this.startTimeFromFilter == null && this.startTimeToFilter == null ? undefined :
                [
                    this.startTimeFromFilter == null ? undefined :
                        this.useRelativeStartTimeFromFilter
                            ? this.relativeStartTimeFromFilterUnit === "days"
                                ? overrideContext.startTimeFromOffset === 0
                                    ? "From the beginning of today"
                                    : overrideContext.startTimeFromOffset! >= 0
                                        ? parser.parse("From the beginning of the day, \n${absStartTimeFromOffset | number} ${absStartTimeFromOffset | plural: 'day' : 'days'} in the future").evaluate(this, overrideContext)
                                        : parser.parse("From the beginning of the day, \n${absStartTimeFromOffset | number} ${absStartTimeFromOffset | plural: 'day' : 'days'} in the past").evaluate(this, overrideContext)
                                : overrideContext.startTimeFromOffset! === 0
                                    ? "From now"
                                    : overrideContext.startTimeFromOffset! >= 0
                                        ? parser.parse("From ${absStartTimeFromOffset | number} ${absStartTimeFromOffset | plural: 'hour' : 'hours'} in the future").evaluate(this, overrideContext)
                                        : parser.parse("From ${absStartTimeFromOffset | number} ${absStartTimeFromOffset | plural: 'hour' : 'hours'} in the past").evaluate(this, overrideContext)
                            : parser.parse("From the beginning of the day, \n${startTimeFromFilter | date}").evaluate(this, overrideContext),

                    this.startTimeToFilter == null ? undefined :
                        this.useRelativeStartTimeToFilter
                            ? this.relativeStartTimeToFilterUnit === "days"
                                ? overrideContext.startTimeToOffset === 0
                                    ? "To the end of today"
                                    : overrideContext.startTimeToOffset! >= 0
                                        ? parser.parse("To the end of the day, \n${absStartTimeToOffset | number} ${absStartTimeToOffset | plural: 'day' : 'days'} in the future").evaluate(this, overrideContext)
                                        : parser.parse("To the end of the day, \n${absStartTimeToOffset | number} ${absStartTimeToOffset | plural: 'day' : 'days'} in the past").evaluate(this, overrideContext)
                                : overrideContext.startTimeToOffset! === 0
                                    ? "To now"
                                    : overrideContext.startTimeToOffset! >= 0
                                        ? parser.parse("To ${absStartTimeToOffset | number} ${absStartTimeToOffset | plural: 'hour' : 'hours'} in the future").evaluate(this, overrideContext)
                                        : parser.parse("To ${absStartTimeToOffset | number} ${absStartTimeToOffset | plural: 'hour' : 'hours'} in the past").evaluate(this, overrideContext)
                            : parser.parse("To the end of the day, \n${startTimeToFilter | date}").evaluate(this, overrideContext)
                ]
                .filter(s => s) as string[]
            },

            // Assignment filter
            {
                slug: "assignment",
                name: "Assignment",
                description: "When this filter is applied, you will only see routes whose assignment status matches one of the specified values",
                model:
                {
                    assignedDriver: this.assignedDriver,
                    notAssignedDriver: this.notAssignedDriver,
                    assignedVehicle: this.assignedVehicle,
                    notAssignedVehicle: this.notAssignedVehicle
                },
                clear: () =>
                {
                    this.assignedDriver = false;
                    this.notAssignedDriver = false;
                    this.assignedVehicle = false;
                    this.notAssignedVehicle = false;
                },
                summary: !(this.assignedDriver || this.notAssignedDriver || this.assignedVehicle || this.notAssignedVehicle) ? undefined :
                [
                    this.assignedDriver ? "Driver assigned" : undefined,
                    this.notAssignedDriver ? "No driver assigned" : undefined,
                    this.assignedVehicle ? "No vehicle assigned" : undefined,
                    this.notAssignedVehicle ? "No vehicle assigned" : undefined
                ]
                .filter(s => s) as string[]
            },

            // Ordered vehicle type filter
            {
                slug: "ordered-vehicle-type",
                name: "Ordered vehicle type",
                description: "When this filter is applied, you will only see routes ordered vehicle type matches one of the specified values",
                model:
                {
                    orderedVehicleTypesFilter: this.orderedVehicleTypesFilter
                },
                clear: () =>
                {
                    this.orderedVehicleTypesFilter = undefined;
                },
                summary: this.orderedVehicleTypesFilter?.map(ovt => ovt.name)
            },

            // Teams filter
            {
                slug: "teams",
                name: "Teams",
                description: "When this filter is applied, you will only see routes ordered vehicle type matches one of the specified values",
                model:
                {
                    teamsFilter: this.teamsFilter
                },
                clear: () =>
                {
                    this.teamsFilter = undefined;
                },
                summary: this.teamsFilter?.map(teamId => teamId) // TODO: How do we get the name here?
            },

            // Tags filter
            {
                slug: "tags",
                name: "Tags",
                description: "When this filter is applied, you will only see routes that have all the specified tags",
                model:
                {
                    tagsFilter: this.tagsFilter
                },
                clear: () =>
                {
                    this.tagsFilter = undefined;
                },
                summary: this.tagsFilter
            },

            // Pickup nearby filter
            {
                slug: "pickup-nearby",
                name: "Pickup nearby",
                description: "When this filter is applied, you will only see routes whose first pickup is near the specified location",
                model:
                {
                    pickupNearbyAddress: this.pickupNearbyAddress
                },
                clear: () =>
                {
                    this.pickupNearbyAddress = undefined;
                },
                summary: this.pickupNearbyAddress == null ? undefined :
                [
                    this.pickupNearbyAddress?.toString()
                ]
            },

            // Owner IDs filter
            {
                slug: "legacy-owner-ids",
                name: "Owner IDs",
                description: "When this filter is applied, you will only see routes owned by one of the specified owner IDs",
                model:
                {
                    legacyOwnerIdsFilter: this.legacyOwnerIdsFilter
                },
                clear: () =>
                {
                    this.legacyOwnerIdsFilter = undefined;
                },
                summary: this.legacyOwnerIdsFilter
            },

            // Created time filter
            {
                slug: "created-time",
                name: "Created time",
                description: "When this filter is applied, you will only see routes created within the specified time range",
                model:
                {
                    createdTimeFromFilter: this.createdTimeFromFilter,
                    createdTimeToFilter: this.createdTimeToFilter
                },
                clear: () =>
                {
                    this.createdTimeFromFilter = undefined;
                    this.createdTimeToFilter = undefined;
                },
                summary: this.createdTimeFromFilter == null && this.createdTimeToFilter == null ? undefined :
                [
                    this.createdTimeFromFilter == null ? undefined :
                        parser.parse("From the beginning of the day, \n${createdTimeFromFilter | date}").evaluate(this, overrideContext),

                    this.createdTimeToFilter == null ? undefined :
                        parser.parse("To the end of the day, \n${createdTimeToFilter | date}").evaluate(this, overrideContext)
                ]
                .filter(s => s) as string[]
            }
        ];

        this.criteria.sort((a, b) => a.name.localeCompare(b.name));

        // tslint:enable
    }

    /**
     * Updates the state of the relative start time filter.
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

        this.update?.(newValue, oldValue, propertyName);
    }

    /**
     * Called when the pickup nearby address has updated
     */
    protected pickupNearbyAddressChanged(): void
    {
        this.pickupNearbyPosition = undefined;

        if (this.pickupNearbyOperation != null)
        {
            this.pickupNearbyOperation.abort();
        }

        if (this.pickupNearbyAddress != null)
        {
            this.pickupNearbyOperation = new Operation(async signal =>
            {
                try
                {
                    const addressService = Container.instance.get(AddressService);

                    const location = await addressService.getLocation(this.pickupNearbyAddress!);

                    this.pickupNearbyPosition = location.position;
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);
                }
            });
        }
    }
}
