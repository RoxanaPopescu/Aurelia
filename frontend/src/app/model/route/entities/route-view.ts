import { observable } from "aurelia-framework";
import { Position, Address } from "app/model/shared";
import { RouteListColumn } from "./route-list-column";
import { RouteStatusSlug } from "./route-status";
import { DateTime, Duration } from "luxon";
import { VehicleType } from "app/model/vehicle";
import { ListViewsPage } from "app/modules/routes/modules/list-views/list-views";

/**
 * Represents an route view.
 */
export class RouteView
{
  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  public constructor(list: ListViewsPage, data: any = null)
  {
    this.list = list;
    this.private = true;

    if (data != null)
    {
      this.name = "TODO";

      this.columns = data.columns.map(slug => new RouteListColumn(slug));
      this.textFilter = data.filters.textFilter;
      this.statusFilter = data.filters.statusFilter;
      this.assignedDriver = data.filters.assignedDriver;
      this.notAssignedDriver = data.filters.notAssignedDriver;
      this.assignedVehicle = data.filters.assignedVehicle;
      this.notAssignedVehicle = data.filters.notAssignedVehicle;
      this.startTimeFromFilter =
        data.filters.startTimeFromFilter != null
          ? DateTime.fromISO(data.filters.startTimeFromFilter, {
              setZone: true
            })
          : undefined;
      this.startTimeToFilter =
        data.filters.startTimeToFilter != null
          ? DateTime.fromISO(data.filters.startTimeToFilter, { setZone: true })
          : undefined;
      this.relativeStartTimeFromFilterUnit =
        data.filters.relativeStartTimeFromFilterUnit;
      this.relativeStartTimeToFilterUnit =
        data.filters.relativeStartTimeToFilterUnit;
      this.tagsFilter = data.filters.tagsFilter;
      this.orderedVehicleTypesFilter =
        data.filters.orderedVehicleTypesFilter?.map(slug => VehicleType.getBySlug(slug));
      this.legacyOwnerIdsFilter = data.filters.legacyOwnerIdsFilter;
      this.createdTimeFromFilter =
        data.filters.createdTimeFromFilter != null
          ? DateTime.fromISO(data.filters.createdTimeFromFilter, {
              setZone: true
            })
          : undefined;
      this.createdTimeToFilter =
        data.filters.createdTimeToFilter != null
          ? DateTime.fromISO(data.filters.createdTimeToFilter, {
              setZone: true
            })
          : undefined;

      this.useRelativeStartTimeFromFilter =
        data.filters.relativeStartTimeFromFilter != null;
      this.relativeStartTimeFromFilter = data.filters
        .relativeStartTimeFromFilter
        ? Duration.fromISO(data.filters.relativeStartTimeFromFilter)
        : undefined;

      this.useRelativeStartTimeToFilter =
        data.filters.relativeStartTimeToFilter != null;
      this.relativeStartTimeToFilter = data.filters.relativeStartTimeToFilter
        ? Duration.fromISO(data.filters.relativeStartTimeToFilter)
        : undefined;

      return;
    }

    this.columns = [
      new RouteListColumn("slug"),
      new RouteListColumn("reference"),
      new RouteListColumn("start-date"),
      new RouteListColumn("start-address"),
      new RouteListColumn("tags"),
      new RouteListColumn("stop-count"),
      new RouteListColumn("vehicle-type"),
      new RouteListColumn("status"),
      new RouteListColumn("driving-list")
    ];

    this.name = "Default";
  }

  /**
   * The list class - TODO: Remove this if we can do observable from this to that class
   */
  private readonly list: ListViewsPage;

  /**
   * The name of the view
   */
  public name: string;

  /**
   * If the view is private
   */
  public private: boolean;

  /**
   * The nearby pickup position
   */
  public pickupNearbyPosition?: Position;

  /**
   * The columns to be shown
   */
  public columns: RouteListColumn[];

  /**
   * The nearby pickup address
   */
  @observable
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
   * The legacy owner IDs to show, only used by Mover Transport in a transition phase.
   */
  @observable({ changeHandler: "update" })
  public legacyOwnerIdsFilter: any[] | undefined;

  /**
   * When any property is updated
   */
  protected update(
    newValue?: any,
    oldValue?: any,
    propertyName?: string
  ): void
  {
    this.list?.update(newValue, oldValue, propertyName);
  }

  /**
   * Gets the current view state, which may be saved as a view preset.
   * @returns The current view state.
   */
  protected getState(): any
  {
    return {
      columns: this.columns.map((column) => column.slug),
      filters: {
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
        orderedVehicleTypesFilter: this.orderedVehicleTypesFilter?.map((vt) => vt.slug),
        legacyOwnerIdsFilter: this.legacyOwnerIdsFilter,
        createdTimeFromFilter: this.createdTimeFromFilter?.toISO(),
        createdTimeToFilter: this.createdTimeToFilter?.toISO()
      }
    };
  }
}
