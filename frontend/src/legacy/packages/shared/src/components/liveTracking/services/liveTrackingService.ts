import { observable, computed } from "mobx";
import BaseService from "shared/src/services/base";
import Localization from "shared/src/localization";
import { routeFlagService } from "./routeFlagService";
import { Driver } from "app/model/driver";
import { RouteService, Route, RouteInfo, RouteStatus } from "app/model/route";
import { LiveTrackingFilter } from "./liveTrackingFilter";

const routeStatusSortOrder: (keyof typeof RouteStatus.values)[] =
  ["not-started", "in-progress", "not-approved", "completed", "cancelled"];

const pollIntervalFocus = 6000;
const pollIntervalOutOfFocus = 30000;

/**
 * Represents a service that manages the routes shown in live tracking.
 */
export class LiveTrackingService {
  constructor(routeService: RouteService) {
    this.routeService = routeService;
    this.startPolling();
  }

  public routeService: RouteService;

  /* tslint:disable-next-line: no-any */
  private pollTimeout: { notStarted: any, inProgress: any, noDriver: any, selectedRoute: any } = {
    notStarted: undefined,
    inProgress: undefined,
    noDriver: undefined,
    selectedRoute: undefined
  };

  public pollInterval = pollIntervalFocus;

  @observable
  public routesNotStarted: RouteInfo[] | undefined;

  @observable
  public routesInProgress: RouteInfo[] | undefined;

  @observable
  public routesNoDriver: RouteInfo[] | undefined;

  @observable
  drivers: Driver[] | undefined;

  @observable
  selectedDrivers: Driver[] = [];

  /**
   * True if the service is stopped
   */
  private stopped = false;

  /**
   * The filters that determien which routes are shown in live tracking.
   */
  @observable
  public filter = new LiveTrackingFilter();

  /**
   * The currently selected route.
   * Note that this instance will be replaced after each poll.
   */
  @observable
  public selectedRouteId: string | undefined;

  /**
   * The currently selected route.
   * Note that this instance will be replaced after each poll.
   */
  @observable
  public selectedRoute: Route | undefined;

  /**
   * The ID of the route stop that was most recently selected.
   */
  @observable
  public selectedRouteStopId: string | undefined;

  @computed
  public get loadedResults(): boolean {
    if (this.routesNotStarted != null ||
        this.routesInProgress != null ||
        this.routesNoDriver != null) {
      return true;
    }

    return false;
  }

  @computed
  public get routes(): RouteInfo[] {
    let routes: RouteInfo[] = [];

    if (this.routesNotStarted != null) {
      routes.concat(this.routesNotStarted);
    }

    if (this.routesInProgress != null) {
      routes.concat(this.routesInProgress);
    }

    if (this.routesNoDriver != null) {
      routes.concat(this.routesNoDriver);
    }

    return routes.sort((a, b) => {

      // Sort watched routes first.
      if (!routeFlagService.isFlagged(b.id) && routeFlagService.isFlagged(a.id)) { return -1; }
      if (routeFlagService.isFlagged(b.id) && !routeFlagService.isFlagged(a.id)) { return 1; }

      const bStatusRank = routeStatusSortOrder.indexOf(b.status.slug);
      const aStatusRank = routeStatusSortOrder.indexOf(a.status.slug);

      // Sort completed or cancelled routes last.
      if ((bStatusRank >= 4 ? 1 : -1) > (aStatusRank >= 4 ? 1 : -1)) { return -1; }
      if ((bStatusRank >= 4 ? 1 : -1) < (aStatusRank >= 4 ? 1 : -1)) { return 1; }

      // Sort by criticality.
      if (b.criticality.rank < a.criticality.rank) { return -1; }
      if (b.criticality.rank > a.criticality.rank) { return 1; }

      // Sort by status.
      if (bStatusRank > aStatusRank) { return -1; }
      if (bStatusRank < aStatusRank) { return 1; }

      // Sort by slug.
      if (b.slug < a.slug) { return -1; }
      if (b.slug > a.slug) { return 1; }

      return 0;
    });
  }

  /**
   * The filtered routes being tracked
   */
  @computed
  public get filteredRoutes(): RouteInfo[] {
    let routes = this.routes;
    if (routes == null) {
      return [];
    }

    if (this.filter.searchQuery == null &&
        this.filter.criticalities.length == 0 &&
        this.filter.vehicleTypes.length == 0 &&
        this.filter.statuses.length == 0 &&
        this.filter.products.length == 0) {
      return routes;
    }

    return routes
      .filter(route => {
        if (this.filter.criticalities.length > 0) {
          if (!this.filter.criticalities.includes(route.criticality.slug)) {
            return false;
          }
        }

        if (this.filter.products.length > 0) {
          if (!this.filter.products.includes(route.productType.slug)) {
            return false;
          }
        }

        if (this.filter.statuses.length > 0) {
          if (!this.filter.statuses.includes(route.status.slug)) {
            return false;
          }
        }

        if (this.filter.vehicleTypes.length > 0) {
          if (!this.filter.vehicleTypes.includes(route.vehicleType.slug)) {
            return false;
          }
        }

        return route.searchModel.contains(this.filter.searchQuery);
      })
  }

  /**
   * Triggers change detection for the `routes` property.
   */
  public triggerRoutesChanged() {
    if (this.routesInProgress != null) {
      this.routesInProgress = [...this.routesInProgress];
    }
  }

  /**
   * Sets the currently selected route.
   * @param route The route to select, or undefined to select no route.
   */
  public setSelectedRouteId(routeId: string | undefined): void {
    this.selectedRouteId = routeId;
    this.selectedRouteStopId = undefined;

    // FIXME: FETCH AND RESET
  }


  /**
   * Starts polling for route data.
   * @returns A promise that will be resolved when the initial request succeedes.
   */
  private async startPolling() {
    this.stopped = false;
    this.poll();
  }

  /**
   * Stops polling
   */
  public stopPolling(): void {
    clearTimeout(this.pollTimeout.inProgress);
    clearTimeout(this.pollTimeout.noDriver);
    clearTimeout(this.pollTimeout.notStarted);
    clearTimeout(this.pollTimeout.selectedRoute);
    this.stopped = true;
  }

  public setNotInFocus() {
    this.pollInterval = pollIntervalOutOfFocus;
  }

  public setInFocus() {
    this.pollInterval = pollIntervalFocus;
  }

  /**
   * Fetches the tracked routes, then schedules the next poll.
   * @returns A promise that will be resolved when the poll succeedes.
   */
  private async poll(): Promise<void> {
    // clearTimeout(this.pollTimeout);

    try {
      // const routes = await this.fetch();

      // The model creation already takes a while, primarily due to less than optimal date parsing in Luxon.
      // To avoid blocking the UI thread for too long, we therefore do the assignments to observable properties
      // within a timeout, thus deferring the react rendering process.
      return new Promise<void>((resolve, reject) => {
        setTimeout(async () => {
          try {

            /*
            this.migrateRouteState(routes);

            this._routes = routes;

            if (this.selectedRouteId != null) {
              const selectedRoute = this._routes.find(r => r.id === this.selectedRouteId);

              if (selectedRoute != null) {
                this.selectedRoute = selectedRoute;
              }
            }*/

            resolve();
          } catch (error) {
            reject(error);
          } finally {
            if (!this.stopped) {
              // FIXME: this.pollTimeout = setTimeout(() => this.poll(), this.pollInterval);
            }
          }
        });
      });

    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error("An error occurred while polling for live tracking data.\n", error);
      // this.pollTimeout = setTimeout(() => this.poll(), 8000);
    }
  }

  /**
   * Fetches the tracked routes.
   * @returns A promise that will be resolved with the routes.
   */
  public async pushToDrivers(drivers: Driver[], route: Route, message: string | undefined): Promise<void> {
    var url = "dispatch/route/pushDrivers";

    const response = await fetch(
      BaseService.url(url),
      BaseService.defaultConfig({
        routeId: route.id,
        driverIds: drivers.map(d => d.id),
        message: message
      })
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    return;
  }

  /**
   * Fetches the tracked routes.
   * @returns A promise that will be resolved with the routes.
   */
  public async fetchDriversNearby(route: Route): Promise<Driver[]> {
    var url = "routes/v2/DriversAvailableNearby";

    const response = await fetch(
      BaseService.url(url),
      BaseService.defaultConfig({
        routeId: route.id
      })
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    const data = await response.json();

    var drivers: Driver[] = [];
    for (let driver of data.results) {
      drivers.push(new Driver(driver));
    }

    return drivers;
  }

  /**
   * Fetches the tracked routes.
   * @returns A promise that will be resolved with the routes.
   */
  /*
  private async fetch(): Promise<RouteLegacy[]> {
    let routes: RouteLegacy[];
    var url = "routes/v2/tracking";

    const response = await fetch(
      BaseService.url(url),
      BaseService.defaultConfig({})
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    const data = await response.json();

    routes = [];

    for (let route of data) {
      try {
        routes.push(new RouteLegacy(route));
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error("An error occurred while instantiating a live tracking route.\n", error, route);
      }
    }

    return routes;
  }
  */

  /**
   * Migrates the client-side state of the routes by migrating it to the corresponding new routes.
   * @param newRoutes The new routes, just fetched from the server.
   */
  /*
  private migrateRouteState(newRoutes: RouteLegacy[]): void {
    if (this._routes != null) {
      for (const newRoute of newRoutes) {
        const oldRoute = this._routes.find(r => r.id === newRoute.id);
        if (oldRoute != null) {
          oldRoute.migrateState(newRoute);
        }
      }
    }
  }
  */

  onSelectDriver(driver: Driver) {
    let index = this.selectedDrivers.indexOf(driver);
      if (index != -1) {
        this.selectedDrivers.splice(index, 1);
      } else {
        this.selectedDrivers.push(driver);
      }
  }
}
