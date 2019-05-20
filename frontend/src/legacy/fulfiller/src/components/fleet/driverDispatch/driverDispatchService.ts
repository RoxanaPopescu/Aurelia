import { observable } from "mobx";
import ForecastsMock from "./mockData/forecasts";
import PreBookingsMock from "./mockData/preBookings";
import OverviewMock from "./mockData/overviewData";
import { DateTime } from "luxon";
import { Forecast } from "./models/forecast";
import { PreBooking } from "./models/preBooking";
import { OverviewData } from "./models/overviewData";
import { Route } from "shared/src/model/logistics/routes/details";

/**
 * Represents a service that manages the data for the driver dispatch view.
 */
export class DriverDispatchService {
  /**
   * True if the service is loading the data for the driver dispatch view, otherwise false.
   */
  @observable public loading = false;

  /**
   * Represents the fulfillee filters applied by the user.
   */
  @observable public fulfilleeFilters: { name: string; id: string }[] = [];

  /**
   * Represents the driver filters applied by the user.
   */
  @observable public driverFilters: { name: string; id: string }[] = [];

  /**
   * Represents the haulier filters applied by the user.
   */
  @observable public haulierFilters: { name: string; id: string }[] = [];

  /**
   * Represents the date filter for the data shown in the view.
   */
  @observable public date: DateTime = DateTime.local(2019, 6, 1);

  /**
   * Represents the forecasts, which fits the search filters.
   */
  @observable public forecasts: Forecast[] = [];

  /**
   * Represents the pre-bookings, which fits the search filters.
   */
  @observable public preBookings: PreBooking[] = [];

  /**
   * Represents the unassigned routes, which fits the search filters.
   */
  @observable public unassignedRoutes: Route[] = [];

  /**
   * Represents the assigned routes, which fits the search filters.
   */
  @observable public assignedRoutes: Route[] = [];

  /**
   * Represents the overview data, which fits the search filters.
   */
  @observable public overviewData: OverviewData[] = [];

  /**
   * Represents the fulfillee filter for the data shown in the view.
   */
  @observable public fulfillees: { name: string; id: string }[] = [];

  /**
   * Represents the driver filter for the data shown in the view.
   */
  @observable public drivers: { name: string; id: string }[] = [];

  /**
   * Represents the haulier filter for the data shown in the view.
   */
  @observable public hauliers: { name: string; id: string }[] = [];

  /**
   * Represents a state for the views.
   */
  @observable public state:
    | "forecasts"
    | "preBookings"
    | "unassignedRoutes"
    | "assignedRoutes" = "forecasts";

  /**
   * Fetches overview data for the given dispatch state.
   * Dispatch states are: Forecasts, pre-bookings, unassigned routes, and assigned routes.
   */
  public async fetchOverview(): Promise<void> {
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

    if (this.state === "forecasts") {
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

    this.fulfillees = data.fulfillees.map(c => {
      return { name: c.name, id: c.id };
    });
    this.drivers = data.drivers.map(d => {
      return { name: d.name, id: d.id };
    });
    this.hauliers = data.hauliers.map(h => {
      return { name: h.name, id: h.id };
    });
  }

  /**
   * Fetches a list of forecasts mathing the specific filters.
   * @returns A promise that will be resolved with an array of forecasts.
   */
  public async fetchForecasts(): Promise<Forecast[]> {
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

    const data = ForecastsMock.map(f => new Forecast(f));
    var filteredData: Forecast[] = [];

    if (this.fulfilleeFilters.length > 0) {
      this.fulfilleeFilters.forEach(cf => {
        var temp = data.filter(d => d.fulfilleeId === cf.id);
        filteredData = filteredData.concat(temp);
      });
    } else {
      filteredData = data;
    }

    return filteredData;
  }

  /**
   * Fetches a list of pre-bookings mathing the specific filters.
   * @returns A promise that will be resolved with an array of pre-bookings.
   */
  public async fetchPreBookings(): Promise<PreBooking[]> {
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

    const data = PreBookingsMock.map(f => new PreBooking(f));
    var filteredData: PreBooking[] = [];

    if (
      this.fulfilleeFilters.length > 0 ||
      this.driverFilters.length > 0 ||
      this.haulierFilters.length > 0
    ) {
      this.fulfilleeFilters.forEach(cf => {
        var temp = data.filter(d => d.fulfilleeId === cf.id);
        filteredData = filteredData.concat(temp);
      });
      this.driverFilters.forEach(df => {
        var temp = data.filter(d => d.driver.id === df.id);
        filteredData = filteredData.concat(temp);
      });
      // TODO: Hauliers
    } else {
      filteredData = data;
    }

    return filteredData;
  }
}

export const driverDispatchService = new DriverDispatchService();
