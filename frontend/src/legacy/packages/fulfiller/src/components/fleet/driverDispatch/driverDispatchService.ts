import { observable } from "mobx";
import OverviewMock from "./dispatch/mockData/overviewData";
import { DateTime } from "luxon";
import { Forecast } from "./models/forecast";
import { PreBooking } from "./models/preBooking";
import { OverviewData } from "./models/overviewData";
import { Route } from "shared/src/model/logistics/routes/details";
import Localization from "shared/src/localization";
import BaseService from "shared/src/services/base";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";
import { Driver } from "shared/src/model/logistics/order/driver";
import { Position } from "../../../../../shared/src/model/general/position";
import {
  SortingDirection,
  SortingDirectionMap
} from "shared/src/model/general/sorting";

export class DispatchState {
  public static readonly map = {
    forecast: {
      slug: "forecast",
      name: "Forecast",
      value: "forecast"
    },
    preBooking: {
      slug: "pre-booking",
      name: "Pre-booking",
      value: "preBooking"
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
  @observable public loading;

  /**
   * Represents the fulfillee filters applied by the user.
   */
  @observable public fulfilleeFilters: { name: string; id: string }[];

  /**
   * Represents the driver filters applied by the user.
   */
  @observable public driverFilters: { name: string; id: string }[];

  /**
   * Represents the haulier filters applied by the user.
   */
  @observable public haulierFilters: { name: string; id: string }[];

  /**
   * Represents the date filter for the data shown in the view.
   */
  @observable public startDateTime: DateTime;

  /**
   * Represents the date filter for the data shown in the view.
   */
  @observable public endDateTime: DateTime;

  /**
   * Represents the forecasts, which fits the search filters.
   */
  @observable public forecasts: Forecast[];

  /**
   * Represents the pre-bookings, which fits the search filters.
   */
  @observable public preBookings: PreBooking[];

  /**
   * Represents the unassigned routes, which fits the search filters.
   */
  @observable public unassignedRoutes: Route[];

  /**
   * Represents the assigned routes, which fits the search filters.
   */
  @observable public assignedRoutes: Route[];

  /**
   * Represents the selected Pre-Bookings, Unassigned Routes
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

    this.loading = false;

    this.fulfilleeFilters = [];
    this.driverFilters = [];
    this.haulierFilters = [];

    this.startDateTime = DateTime.local().startOf("day");
    this.endDateTime = DateTime.local().endOf("day");

    this.forecasts = [];
    this.preBookings = [];
    this.unassignedRoutes = [];
    this.assignedRoutes = [];
    this.selectedItemIndexes = [];

    this.fulfillees = [];
    this.drivers = [];
    this.hauliers = [];
  }

  /**
   * Fetches overview data for the given dispatch state.
   * Dispatch states are: Forecasts, pre-bookings, unassigned routes, and assigned routes.
   */
  public async fetchOverview(): Promise<void> {
    // this.fulfillees = [];
    // this.drivers = [];
    // this.hauliers = [];
    // this.fulfilleeFilters = [];
    // this.driverFilters = [];
    // this.haulierFilters = [];
    // const response = await fetch(
    //   BaseService.url("driverDispatch/", { routeSlug }),
    //   BaseService.defaultConfig()
    // );

    // if (response.status === 404) {
    //   const error = new Error(Localization.sharedValue("Error_RouteNotFound"));
    //   error.name = "not-found-error";
    //   throw error;
    // }
    // if (!response.ok) {
    //   throw new Error(Localization.sharedValue("Error_General"));
    // }

    const data = OverviewMock;

    if (this.state.slug === DispatchState.map.forecast.slug) {
      this.overviewData = [
        new OverviewData("Forecast slots", data.forecastSlots.total),
        new OverviewData("Assigned slots", data.forecastSlots.assigned),
        new OverviewData(
          "Unassigned slots",
          data.forecastSlots.total - data.forecastSlots.assigned
        )
      ];
    } else {
      this.overviewData = [
        new OverviewData("Pre-bookings", data.forecastSlots.total),
        new OverviewData("Unassigned routes", data.forecastSlots.assigned),
        new OverviewData(
          "Assigned routes",
          data.forecastSlots.total - data.forecastSlots.assigned
        )
      ];
    }

    if (this.state.slug === DispatchState.map.forecast.slug) {
      this.forecasts.forEach(f => {
        if (
          this.fulfillees.filter(ff => ff.id === f.fulfilleeId).length === 0
        ) {
          this.fulfillees.push({ name: f.fulfilleeName, id: f.fulfilleeId });
        }
      });
    } else if (this.state.slug === DispatchState.map.preBooking.slug) {
      this.preBookings.forEach(p => {
        if (this.fulfillees.filter(f => f.id === p.fulfilleeId).length === 0) {
          this.fulfillees.push({ name: p.fulfilleeName, id: p.fulfilleeId });
        }
        if (this.drivers.filter(d => d.id === p.driver.id).length === 0) {
          this.drivers.push({
            name: p.driver.formattedName,
            id: p.driver.id
          });
        }
      });
    }
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
            fulfilleeId: uf.forecast.fulfilleeId,
            date: uf.forecast.date,
            timePeriod: uf.forecast.timePeriod,
            startingAddress: uf.forecast.startingAddress,
            vehicleTypeId: uf.forecast.vehicleType.id,
            slots: uf.newTotalSlots
          };
        })
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
  }

  /**
   * Creates a forecast with a specific set of parameters
   */
  public async createForecast(forecast: {
    fulfilleeId: string;
    date: DateTime;
    timePeriod: DateTimeRange;
    startingAddress: string;
    vehicleTypeId: string;
    slots: number;
  }): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/forecast/create"),
      BaseService.defaultConfig(forecast)
    );

    if (response.status === 404) {
      const error = new Error(Localization.sharedValue("Error_RouteNotFound"));
      error.name = "not-found-error";
      throw error;
    }
    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  /**
   * Deletes a prebooking with a specific ID.
   */
  public async removePreBooking(ids: string[]): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/delete"),
      BaseService.defaultConfig({
        prebookingIds: ids
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
  }

  /**
   * Fetches a Forecast with a specific ID.
   * @returns A promise that will be resolved with Forecast.
   */
  public async fetchForecast(id: string): Promise<Forecast> {
    const response = await fetch(
      BaseService.url("dispatch/forecast/details"),
      BaseService.defaultConfig({
        id: id
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

    try {
      let responseJson = await response.json();
      return new Forecast(responseJson);
    } catch {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  /**
   * Creates pre-bookings for drivers, linking them to a specific forecast
   */
  public async createPreBookings(
    forecast: Forecast,
    drivers: Driver[]
  ): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/create"),
      BaseService.defaultConfig({
        forecast: {
          id: forecast.id,
          fulfilleeId: forecast.fulfilleeId,
          date: forecast.date,
          timePeriod: forecast.timePeriod,
          startingAddress: forecast.startingAddress,
          vehicleTypeId: forecast.vehicleType.id,
          slots: forecast.slots.total
        },
        driverIds: drivers.map(d => d.id)
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
  }

  /**
   * Fetches unassigned routes with specific IDs.
   * @returns A promise that will be resolved with an array of routes.
   */
  public async fetchUnassignedRoutes(ids: string[]): Promise<Route[]> {
    // const response = await fetch(
    //   BaseService.url("dispatch/forecast/details"),
    //   BaseService.defaultConfig({
    //     ids: ids
    //   })
    // );

    // if (response.status === 404) {
    //   const error = new Error(Localization.sharedValue("Error_RouteNotFound"));
    //   error.name = "not-found-error";
    //   throw error;
    // }
    // if (!response.ok) {
    //   throw new Error(Localization.sharedValue("Error_General"));
    // }

    var responseData: Route[] = [];
    // try {
    //   let responseJson = await response.json();
    //   return responseJson.map(rj => new Route(rj));
    // } catch {
    //   throw new Error(Localization.sharedValue("Error_General"));
    // }

    return responseData;
  }

  /**
   * Fetches a list of drivers matching the specific filters.
   * @returns A promise that will be resolved with an array of drivers.
   */
  public async fetchDrivers(
    filter: {
      date: DateTime;
      search: string;
      fulfilleeId?: string;
      position?: Position;
      vehicleTypeId?: string;
      period?: DateTimeRange;
      driverIds?: string[];
    },
    sorting?: {
      field: DriversListSortingMap;
      direction: SortingDirection;
    },
    paging?: {
      page: number;
      pageSize: number;
    }
  ): Promise<{ drivers: Driver[]; totalCount: number }> {
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
      const error = new Error(Localization.sharedValue("Error_RouteNotFound"));
      error.name = "not-found-error";
      throw error;
    }
    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    try {
      let responseJson = await response.json();
      return {
        drivers: responseJson.result.map(d => new Driver(d)),
        totalCount: responseJson.totalCount
      };
    } catch {
      return { drivers: [], totalCount: 0 };
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
        startDate: startDate ? startDate : this.startDateTime,
        endDate: endDate ? endDate : this.endDateTime,
        startTime: startTime ? startTime : this.startDateTime,
        endTime: endTime ? endTime : this.endDateTime,
        fulfilleeIds: this.fulfilleeFilters.map(ff => ff.id)
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

    var responseData = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.map(f => new Forecast(f));
    } catch {
      // Do something
    }

    this.fetchOverview(); // Remove later
    return responseData;
  }

  /**
   * Fetches a list of pre-bookings matching the specific filters.
   */
  public async fetchPreBookings(
    startDate?: DateTime,
    endDate?: DateTime,
    startTime?: DateTime,
    endTime?: DateTime
  ): Promise<PreBooking[]> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/list"),
      BaseService.defaultConfig({
        startDate: startDate ? startDate : this.startDateTime,
        endDate: endDate ? endDate : this.endDateTime,
        startTime: startTime ? startTime : this.startDateTime,
        endTime: endTime ? endTime : this.endDateTime,
        fulfilleeIds: this.fulfilleeFilters.map(ff => ff.id),
        fulfillerIds: this.haulierFilters.map(h => h.id),
        driverIds: this.driverFilters.map(d => d.id)
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

    var responseData = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.map(f => new PreBooking(f));
    } catch {
      // DO something
    }

    this.fetchOverview(); // Remove later
    return responseData;
  }

  /**
   * Fetches a list of pre-bookings matching the specific ids.
   */
  public async fetchPreBookingsFromIds(ids: string[]): Promise<PreBooking[]> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/list"),
      BaseService.defaultConfig({
        ids: ids
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

    var responseData = [];
    try {
      let responseJson = await response.json();
      responseData = responseJson.map(f => new PreBooking(f));
    } catch {
      // DO something
    }

    this.fetchOverview(); // Remove later
    return responseData;
  }
}

export const driverDispatchService = new DriverDispatchService();
