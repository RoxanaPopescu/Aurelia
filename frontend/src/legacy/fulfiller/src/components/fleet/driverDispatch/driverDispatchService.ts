import { observable } from "mobx";
import OverviewMock from "./dispatch/mockData/overviewData";
import { DateTime } from "luxon";
import { Forecast } from "./models/forecast";
import { PreBooking } from "./models/preBooking";
import { OverviewData } from "./models/overviewData";
import { Route } from "shared/src/model/logistics/routes/details";
import Localization from "shared/src/localization";
import BaseService from "shared/src/services/base";

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
    this.fulfillees = [];
    this.drivers = [];
    this.hauliers = [];
    this.fulfilleeFilters = [];
    this.driverFilters = [];
    this.haulierFilters = [];
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
  public async updateForecast(
    forecast: Forecast,
    newTotalSlots: number
  ): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/forecast/update"),
      BaseService.defaultConfig({
        id: forecast.id,
        fulfilleeId: forecast.fulfilleeId,
        date: forecast.date,
        timePeriod: forecast.timeFrame,
        startingAddress: forecast.startingAddress,
        vehicleTypeId: forecast.vehicleType.id,
        slots: newTotalSlots
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
   * Fetches a list of forecasts mathing the specific filters.
   * @returns A promise that will be resolved with an array of forecasts.
   */
  public async fetchForecasts(): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/forecast/list"),
      BaseService.defaultConfig({
        startDate: this.startDateTime,
        endDate: this.endDateTime,
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

    try {
      let responseJson = await response.json();
      this.forecasts = responseJson.map(f => new Forecast(f));
    } catch {
      this.forecasts = [];
    }
    this.fetchOverview(); // Remove later
  }

  /**
   * Fetches a list of pre-bookings mathing the specific filters.
   * @returns A promise that will be resolved with an array of pre-bookings.
   */
  public async fetchPreBookings(): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/prebooking/list"),
      BaseService.defaultConfig({
        startDate: this.startDateTime,
        endDate: this.endDateTime,
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

    try {
      let responseJson = await response.json();
      this.preBookings = responseJson.map(f => new PreBooking(f));
    } catch {
      this.preBookings = [];
    }
    this.fetchOverview(); // Remove later
  }
}

export const driverDispatchService = new DriverDispatchService();
