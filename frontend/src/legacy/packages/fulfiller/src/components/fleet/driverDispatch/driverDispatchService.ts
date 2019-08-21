import { observable } from "mobx";
import { DateTime } from "luxon";
import { Forecast } from "./models/forecast";
import { Prebooking } from "./models/prebooking";
import { OverviewData } from "./models/overviewData";
import Localization from "shared/src/localization";
import { Location } from "shared/src/model/general/location";
import BaseService from "shared/src/services/base";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";
import { Driver } from "shared/src/model/logistics/order/driver";
import { Position } from "../../../../../shared/src/model/general/position";
import {
  SortingDirection,
  SortingDirectionMap
} from "shared/src/model/general/sorting";
import { Route } from "shared/src/components/routes/list/models/route";

export class DispatchState {
  public static readonly map = {
    forecast: {
      slug: "forecast",
      name: "Forecast",
      value: "forecast"
    },
    prebooking: {
      slug: "prebooking",
      name: "Prebooking",
      value: "prebooking"
    },
    unassignedRoute: {
      slug: "unassigned-route",
      name: "Unassigned routes",
      value: "unassignedRoute"
    },
    assignedRoute: {
      slug: "assigned-route",
      name: "Assigned routes",
      value: "assignedRoute"
    }
  };

  public constructor(status: keyof typeof DispatchState.map) {
    Object.assign(this, DispatchState.map[status]);
  }

  public slug: keyof typeof DispatchState.map;
  public name: string;
  public value: string;
}

export type OrdersListSortingKey =
  | "OrderId"
  | "ConsignorId"
  | "ConsignorCompanyName"
  | "ConsignorAddress"
  | "ConsignorPhoneNumber"
  | "PickupEarliestDate"
  | "PickupEarliestTime"
  | "PickupLastestDate"
  | "PickupLatestTime"
  | "ConsigneePersonName"
  | "ConsigneeCompanyName"
  | "ConsigneeAddress"
  | "ConsigneePhoneNumber"
  | "DeliveryEarliestDate"
  | "DeliveryEarliestTime"
  | "DeliveryLatestDate"
  | "DeliveryLatestTime"
  | "EstimatedColli"
  | "ActualColli"
  | "Status";

export class DriversListSortingMap {
  public static readonly map = {
    NoSorting: { id: 0 },
    DriverId: { id: 1 },
    DriverName: { id: 2 },
    DriverPhone: { id: 3 },
    CompanyName: { id: 4 },
    CompanyId: { id: 5 },
    VehicleTypeID: { id: 6 },
    DriverState: { id: 7 }
  };

  public constructor(status: keyof typeof DriversListSortingMap.map) {
    this.slug = status;
    Object.assign(this, DriversListSortingMap.map[status]);
  }

  public slug: keyof typeof DriversListSortingMap.map;
  public id: number;
}

/**
 * Represents a service that manages the data for the driver dispatch view.
 */
export class DriverDispatchService {
  /**
   * True if the service is loading the data for the driver dispatch view, otherwise false.
   */
  @observable public toast?: { message: string; type: "error" | "ok" };

  /**
   * Represents the fulfillee filters applied by the user.
   */
  @observable public fulfilleeFilters: { name: string; id: string | number }[];

  /**
   * Represents the driver filters applied by the user.
   */
  @observable public driverFilters: { name: string; id: string | number }[];

  /**
   * Represents the haulier filters applied by the user.
   */
  @observable public haulierFilters: { name: string; id: string | number }[];

  /**
   * Represents the start date filter for the data shown in the view.
   */
  @observable public startDate: DateTime;

  /**
   * Represents the end date filter for the data shown in the view.
   */
  @observable public endDate: DateTime;

  /**
   * Represents the start time filter for the data shown in the view.
   */
  @observable public startTime: DateTime;

  /**
   * Represents the end time filter for the data shown in the view.
   */
  @observable public endTime: DateTime;

  /**
   * Represents the forecasts, which fits the search filters.
   */
  @observable public forecasts: Forecast[];

  /**
   * Represents the prebookings, which fits the search filters.
   */
  @observable public prebookings: Prebooking[];

  /**
   * Represents the unassigned routes, which fits the search filters.
   */
  @observable public unassignedRoutes: Route[];

  /**
   * Represents the assigned routes, which fits the search filters.
   */
  @observable public assignedRoutes: Route[];

  /**
   * Represents the selected Prebookings, Unassigned Routes
   * or Routes indexes.
   */
  @observable public selectedItemIndexes: number[];

  /**
   * Represents the overview data, which fits the search filters.
   */
  @observable public overviewData: OverviewData[];

  /**
   * Represents the fulfillee filter for the data shown in the view.
   */
  @observable public fulfillees: { name: string; id: string }[];

  /**
   * Represents the driver filter for the data shown in the view.
   */
  @observable public drivers: { name: string; id: string }[];

  /**
   * Represents the haulier filter for the data shown in the view.
   */
  @observable public hauliers: { name: string; id: string }[];

  /**
   * Represents a state for the views.
   */
  @observable public state: DispatchState;

  constructor() {
    this.setDefaultValues(true);
  }

  public setDefaultValues(firstMount?: boolean) {
    if (firstMount) {
      this.state = new DispatchState("forecast");
    }

    this.fulfilleeFilters = [];
    this.driverFilters = [];
    this.haulierFilters = [];

    this.startDate = DateTime.local().startOf("day");
    this.endDate = DateTime.local().startOf("day");

    this.forecasts = [];
    this.prebookings = [];
    this.unassignedRoutes = [];
    this.assignedRoutes = [];
    this.selectedItemIndexes = [];

    this.fulfillees = [];
    this.drivers = [];
    this.hauliers = [];
  }

  /**
   * Fetches overview data for the given dispatch state.
   * Dispatch states are: Forecasts, prebookings, unassigned routes, and assigned routes.
   */
  public async fetchOverview(): Promise<void> {
    if (
      this.state.value !== "unassignedRoute" &&
      this.state.value !== "assignedRoute"
    ) {
      const response = await fetch(
        BaseService.url(`dispatch/${this.state.value}/listfulfillees`),
        BaseService.defaultConfig({
          startDate: this.startDate,
          endDate: this.endDate,
          startTime: this.startTime,
          endTime: this.endTime,
          fulfilleeIds: this.fulfilleeFilters.map(ff => ff.id)
        })
      );

      if (response.status === 404) {
        this.toast = { message: "404 not found", type: "error" };
        return;
      }
      if (!response.ok) {
        this.toast = { message: "The operation failed", type: "error" };
        return;
      }

      var fulfillees: { name: string; id: string }[] = [];
      try {
        let responseJson = await response.json();
        fulfillees = responseJson;
      } catch {
        this.toast = { message: "Something went wrong", type: "error" };
      }

      this.fulfillees = fulfillees;
    }

    var drivers: { name: string; id: string }[] = [];
    if (this.state.value === "prebooking") {
      const driverResponse = await fetch(
        BaseService.url(`dispatch/${this.state.value}/listdrivers`),
        BaseService.defaultConfig({
          startDate: this.startDate,
          endDate: this.endDate
        })
      );

      if (driverResponse.status === 404) {
        this.toast = { message: "404 not found", type: "error" };
        return;
      }
      if (!driverResponse.ok) {
        this.toast = { message: "The operation failed", type: "error" };
        return;
      }

      try {
        let driverResponseJson = await driverResponse.json();
        drivers = driverResponseJson.map(d => {
          return { id: d.id, name: `${d.name.first} ${d.name.last}` };
        });
      } catch {
        this.toast = { message: "Something went wrong", type: "error" };
      }
    }

    this.drivers = drivers;
  }

  /**
   * Updates the total amount of slots in a Forecast
   */
  public async updateForecasts(
    updatedForecasts: { forecast: Forecast; newTotalSlots: number }[]
  ): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/forecast/update"),
      BaseService.defaultConfig({
        forecasts: updatedForecasts.map(uf => {
          return {
            id: uf.forecast.id,
            fulfilleeId: uf.forecast.ownerOutfitId,
            date: uf.forecast.date,
            timePeriod: uf.forecast.timePeriod,
            startingAddress: uf.forecast.startingLocation,
            vehicleTypeId: uf.forecast.vehicleType.id,
            slots: uf.newTotalSlots
          };
        })
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
      return;
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
      return;
    }
  }

  /**
   * Creates a forecast with a specific set of parameters
   */
  public async createForecast(forecast: {
    fulfilleeId: string;
    date: DateTime;
    timePeriod: DateTimeRange;
    startingAddress: Location;
    vehicleTypeId: string;
    slots: number;
  }): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/forecast/create"),
      BaseService.defaultConfig(forecast)
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
      return;
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
      return;
    }

    this.toast = {
      message: `Created 1 forecast for ${Localization.formatDate(
        forecast.date
      )}`,
      type: "ok"
    };
  }

  /**
   * Deletes a prebooking with a specific ID.
   */
  public async removePrebooking(ids: string[]): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/delete"),
      BaseService.defaultConfig({
        prebookingIds: ids
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
      return;
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
      return;
    }

    this.toast = {
      message: `Removed ${ids.length} prebookings`,
      type: "ok"
    };
    this.selectedItemIndexes = [];
  }

  /**
   * Fetches a Forecast with a specific ID.
   * @returns A promise that will be resolved with Forecast.
   */
  public async fetchForecast(id: string): Promise<Forecast | undefined> {
    const response = await fetch(
      BaseService.url("dispatch/forecast/details"),
      BaseService.defaultConfig({
        id: id
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
      return;
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
      return;
    }

    try {
      let responseJson = await response.json();
      return new Forecast(responseJson);
    } catch {
      this.toast = {
        message: Localization.sharedValue("Error_General"),
        type: "error"
      };
      return;
    }
  }

  /**
   * Creates prebookings for drivers, linking them to a specific forecast
   */
  public async createPrebookings(
    forecast: Forecast,
    drivers: Driver[]
  ): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/create"),
      BaseService.defaultConfig({
        forecast: {
          id: forecast.id,
          fulfilleeId: forecast.ownerOutfitId,
          date: forecast.date,
          timePeriod: forecast.timePeriod,
          startingAddress: forecast.startingLocation,
          vehicleTypeId: forecast.vehicleType.id,
          slots: forecast.slots.total
        },
        driverIds: drivers.map(d => d.id)
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
      return;
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
      return;
    }

    this.toast = {
      message: `Created ${
        drivers.length
      } prebookings for ${forecast.fulfillee.name} (${Localization.formatDate(forecast.date)})`,
      type: "ok"
    };
  }

  /**
   * Fetches unassigned routes
   * @returns A promise that will be resolved with an array of routes.
   */
  public async fetchUnassignedRoutes(
    startDate?: DateTime,
    endDate?: DateTime,
    startTime?: DateTime,
    endTime?: DateTime,
    fulfileeIds?: { name: string, id: string | number }[]
  ): Promise<Route[]> {
    const response = await fetch(
      BaseService.url("dispatch/route/unassigned/list"),
      BaseService.defaultConfig({
        startDate: startDate ? startDate : this.startDate,
        endDate: endDate ? endDate : this.endDate,
        startTime: startTime ? startTime : this.startTime,
        endTime: endTime ? endTime : this.endTime,
        fulfilleeIds: fulfileeIds ? fulfileeIds : this.fulfilleeFilters.map(ff => ff.id),
        page: 1, // Temporary
        pageSize: 2000 // Temporary
      })
    );

    if (response.status === 404) {
      const error = new Error(Localization.sharedValue("Error_RouteNotFound"));
      error.name = "not-found-error";
      throw error;
    }
    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    var responseData: Route[] = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.routes.map(r => new Route(r));
    } catch {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    return responseData;
  }

  /**
   * Fetches unassigned routes by gives ids
   * @returns A promise that will be resolved with an array of routes.
   */
  public async fetchUnassignedRoutesByIds(ids?: string[]): Promise<Route[]> {
    const response = await fetch(
      BaseService.url("dispatch/route/unassigned/listbyids"),
      BaseService.defaultConfig({
        routeIds: ids,
        page: 1, // Temporary
        pageSize: 2000 // Temporary
      })
    );

    if (response.status === 404) {
      const error = new Error(Localization.sharedValue("Error_RouteNotFound"));
      error.name = "not-found-error";
      throw error;
    }
    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    var responseData: Route[] = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.routes.map(r => new Route(r));
    } catch {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    return responseData;
  }

  /**
   * Fetches assigned routes with specific IDs.
   * @returns A promise that will be resolved with an array of routes.
   */
  public async fetchAssignedRoutes(): Promise<Route[]> {
    const response = await fetch(
      BaseService.url("dispatch/route/assigned/list"),
      BaseService.defaultConfig({
        startDate: this.startDate,
        endDate: this.endDate,
        startTime: this.startTime,
        endTime: this.endTime,
        fulfilleeIds: this.fulfilleeFilters.map(ff => ff.id),
        page: 1, // Temporary
        pageSize: 2000 // Temporary
      })
    );

    if (response.status === 404) {
      const error = new Error(Localization.sharedValue("Error_RouteNotFound"));
      error.name = "not-found-error";
      throw error;
    }
    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    var responseData: Route[] = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.routes.map(r => new Route(r));
    } catch {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    return responseData;
  }

  /**
   * Fetches a list of drivers matching the specific filters.
   * @returns A promise that will be resolved setting an array of drivers.
   */
  public async fetchDrivers(
    filter: {
      date: DateTime;
      search: string;
      fulfilleeId?: string;
      position?: Position;
      vehicleTypeId?: string;
      period?: DateTimeRange;
      driverIds: string[];
    },
    sorting?: {
      field: DriversListSortingMap;
      direction: SortingDirection;
    },
    paging?: {
      page: number;
      pageSize: number;
    }
  ): Promise<{ drivers: Driver[]; totalCount: number } | undefined> {
    const response = await fetch(
      BaseService.url("drivers/query"),
      BaseService.defaultConfig({
        filter: filter,
        sorting: sorting
          ? {
              field: sorting.field.id,
              direction: new SortingDirectionMap(sorting.direction).id
            }
          : undefined,
        paging: paging ? {} : undefined
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
      return;
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
      return;
    }

    try {
      let responseJson = await response.json();
      return {
        drivers: responseJson.result.map(d => new Driver(d)),
        totalCount: responseJson.totalCount
      };
    } catch {
      this.toast = {
        message: Localization.sharedValue("Error_General"),
        type: "error"
      };
      return;
    }
  }


  /**
   * Fetches a driver from the provided id.
   * @returns A promise that will be resolved with a driver object.
   */
  public async fetchDriverById(driverId: number): Promise<Driver | undefined> {
    const response = await fetch(
      BaseService.url("drivers/details", { id: driverId.toString() }),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();

    return new Driver(data);
  }

  /**
   * Assigns an array of drivers to an array of unassigned routes.
   * @returns A promise that will be resolved with an array of statuses
   * of the pairings sent.
   */
  public async assignDrivers(
    pairings: { routeId: string, driverId: number }[]
  ): Promise<{ routeId: string, driverId: number, isAssigned: boolean }[] | undefined> {
    const response = await fetch(
      BaseService.url("dispatch/route/assignDrivers"),
      BaseService.defaultConfig({
        assignments: pairings
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
      return;
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
      return;
    }

    try {
      let responseJson = await response.json();
      return responseJson;
    } catch {
      this.toast = {
        message: Localization.sharedValue("Error_General"),
        type: "error"
      };
      return;
    }
  }

  /**
   * Fetches a list of forecasts matching the specific filters.
   */
  public async fetchForecasts(
    startDate?: DateTime,
    endDate?: DateTime,
    startTime?: DateTime,
    endTime?: DateTime
  ): Promise<Forecast[]> {
    const response = await fetch(
      BaseService.url("dispatch/forecast/list"),
      BaseService.defaultConfig({
        startDate: startDate ? startDate : this.startDate,
        endDate: endDate ? endDate : this.endDate,
        startTime: startTime ? startTime : this.startTime,
        endTime: endTime ? endTime : this.endTime,
        fulfilleeIds: this.fulfilleeFilters.map(ff => ff.id)
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
    }

    var responseData = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.map(f => new Forecast(f));
    } catch {
      this.toast = {
        message: Localization.sharedValue("Error_General"),
        type: "error"
      };
    }

    return responseData;
  }

  /**
   * Fetches a list of prebookings matching the specific filters.
   */
  public async fetchPrebookings(
    startDate?: DateTime,
    endDate?: DateTime,
    startTime?: DateTime,
    endTime?: DateTime
  ): Promise<Prebooking[]> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/list"),
      BaseService.defaultConfig({
        startDate: startDate ? startDate : this.startDate,
        endDate: endDate ? endDate : this.endDate,
        startTime: startTime ? startTime : this.startTime,
        endTime: endTime ? endTime : this.endTime,
        fulfilleeIds: this.fulfilleeFilters.map(ff => ff.id),
        fulfillerIds: this.haulierFilters.map(h => h.id),
        driverIds: this.driverFilters.map(d => d.id)
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
    }

    var responseData = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.map(f => new Prebooking(f));
    } catch {
      this.toast = {
        message: Localization.sharedValue("Error_General"),
        type: "error"
      };
    }

    return responseData;
  }

  /**
   * Fetches a list of prebookings matching the specific ids.
   */
  public async fetchPrebookingsFromIds(ids: string[]): Promise<Prebooking[]> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/listbyids"),
      BaseService.defaultConfig({
        ids: ids
      })
    );

    if (response.status === 404) {
      this.toast = { message: "404 not found", type: "error" };
    }
    if (!response.ok) {
      this.toast = { message: "The operation failed", type: "error" };
    }

    var responseData = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.map(f => new Prebooking(f));
    } catch {
      this.toast = {
        message: Localization.sharedValue("Error_General"),
        type: "error"
      };
    }

    return responseData;
  }
}

export const driverDispatchService = new DriverDispatchService();
