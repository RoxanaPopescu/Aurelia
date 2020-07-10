import { observable, computed } from "mobx";
import BaseService from "shared/src/services/base";
import Localization from "shared/src/localization";
import { Route } from "shared/src/model/logistics/routes/tracking";
import { RouteStatus } from "shared/src/model/logistics/routes";
import { routeFlagService } from "./routeFlagService";
import { Driver } from "app/model/driver";
import { RouteCriticalitySlug, RouteStatusSlug, RouteCriticality } from "app/model/route";
import { ProductTypeSlug, ProductType } from "app/model/product";
import { VehicleType } from "shared/src/model/session";

const filterProductTypesKey = "live-tracking-filter-products";
const routeStatusSortOrder: (keyof typeof RouteStatus.map)[] =
  ["not-started", "in-progress", "not-approved", "completed", "cancelled"];

/**
 * Represents the filters that determien which routes are shown in live tracking.
 */
export class RouteFilter {

  constructor() {
    let productTypes = localStorage.getItem(filterProductTypesKey);
    if (productTypes != null) {
      this.products = JSON.parse(productTypes);
    }
  }

  /**
   * The search query apply, or undefined to apply no text filter.
   */
  @observable
  public searchQuery: string | undefined;

  /**
   * The criticality filter to apply.
   */
  @observable
  public criticalities: RouteCriticalitySlug[] = [];

  /**
   * The products filter to apply.
   */
  @observable
  public products: ProductTypeSlug[] = [];

  /**
   * The statues to show
   */
  @observable
  public statuses: RouteStatusSlug[] = [];

  /**
   * The statues to show
   */
  @observable
  public vehicleTypes: string[] = [];

  /**
   * The amount of filters applied
   */
  @computed
  public get enabledCount(): number {
    let count = 0;

    if (this.criticalities.length > 0 && this.criticalities.length != 3) {
      count++;
    }

    if (this.products.length > 0 && this.products.length != 3) {
      count++;
    }

    if (this.statuses.length > 0 && this.statuses.length != 3) {
      count++;
    }

    if (this.vehicleTypes.length > 0 && this.vehicleTypes.length != VehicleType.getAll().length) {
      count++;
    }

    if (this.searchQuery != null) {
      count++;
    }

    return count;
  }

  criticalityEnabled(criticality: RouteCriticalitySlug): boolean {
    if (this.criticalities.length == 3 || this.criticalities.length == 0) {
      return true;
    }

    return this.criticalities.includes(criticality);
  }

  criticalityEnableDisable(criticality: RouteCriticalitySlug) {
    let results = [...this.criticalities];
    if (results.length == 0) {
      results = Object.keys(RouteCriticality.values) as RouteCriticalitySlug[];
    }

    let index = results.indexOf(criticality);
    if (index != -1) {
      results.splice(index, 1);
    } else {
      results.push(criticality);
    }

    this.criticalities = results;
  }

  statusEnabled(status: RouteStatusSlug): boolean {
    if (this.statuses.length == 3 || this.statuses.length == 0) {
      return true;
    }

    return this.statuses.includes(status);
  }

  statusEnableDisable(status: RouteStatusSlug) {
    let results = [...this.statuses];
    if (results.length == 0) {
      results = ["not-started", "not-approved", "in-progress"];
    }

    let index = results.indexOf(status);
    if (index != -1) {
      results.splice(index, 1);
    } else {
      results.push(status);
    }

    this.statuses = results;
  }

  vehicleTypeEnabled(slug: string): boolean {
    if (this.vehicleTypes.length == VehicleType.getAll().length || this.vehicleTypes.length == 0) {
      return true;
    }

    return this.vehicleTypes.includes(slug);
  }

  vehicleTypeEnableDisable(slug: string) {
    let results = [...this.vehicleTypes];
    if (results.length == 0) {
      results = VehicleType.getAll().map(v => v.slug);
    }

    let index = results.indexOf(slug);
    if (index != -1) {
      results.splice(index, 1);
    } else {
      results.push(slug);
    }

    this.vehicleTypes = results;
  }

  productEnabled(product: ProductTypeSlug): boolean {
    if (this.products.length == 3 || this.products.length == 0) {
      return true;
    }

    return this.products.includes(product);
  }

  productEnableDisable(product: ProductTypeSlug) {
    let results = [...this.products];
    if (results.length == 0) {
      results = Object.keys(ProductType.values) as ProductTypeSlug[];
    }

    let index = results.indexOf(product);
    if (index != -1) {
      results.splice(index, 1);
    } else {
      results.push(product);
    }

    this.products = results;
    console.log(this.products);
    localStorage.setItem(filterProductTypesKey, JSON.stringify(results));
  }
}

const pollIntervalFocus = 7000;
const pollIntervalOutOfFocus = 30000;

/**
 * Represents a service that manages the routes shown in live tracking.
 */
export class RoutesServiceLegacy {

  /* tslint:disable-next-line: no-any */
  private pollTimeout: any;
  private pollSession = 0;
  private pollInterval = pollIntervalFocus;

  @observable
  public _routes: Route[] | undefined;

  @observable
  drivers: Driver[] | undefined;

  @observable
  selectedDrivers: Driver[] = [];

  /**
   * True if the service is loading the routes, otherwise false.
   * Note that this will only be true for the initial request,
   * not while polling for updates.
   */
  @observable
  public loading = false;

  /**
   * True if the service is polling for updates, otherwise false.
   */
  @observable
  public polling = false;

  /**
   * True if the service is paused for polling for updates, otherwise false.
   */
  private paused = false;

  /**
   * The filters that determien which routes are shown in live tracking.
   */
  @observable
  public filter = new RouteFilter();


  /**
   * The currently selected route.
   * Note that this instance will be replaced after each poll.
   */
  @observable
  public selectedRoute: Route | undefined;

  /**
   * The ID of the currently selected route.
   */
  @observable
  public selectedRouteId: string | undefined;

  /**
   * The ID of the route stop that was most recently selected.
   */
  @observable
  public selectedRouteStopId: string | undefined;

  /**
   * The filtered routes being tracked
   */
  @computed
  public get filteredRoutes(): Route[] {
    if (this.routes == undefined) {
      return [];
    }

    if (this.filter.searchQuery == null && this.filter.criticalities.length == 0 && this.filter.vehicleTypes.length == 0 && this.filter.statuses.length == 0 && this.filter.products.length == 0) {
      return this.routes;
    }

    return this.routes
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

        return route.containsText(this.filter.searchQuery);
      })
  }

  /**
   * The routes being tracked.
   * Note that this array will be replaced after each poll.
   */
  @computed
  public get routes(): Route[] | undefined {
    return this._routes ? this._routes.slice().sort((a, b) => {

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
    }) : undefined;
  }

  /**
   * Triggers change detection for the `routes` property.
   */
  public triggerRoutesChanged() {
    if (this._routes != null) {
      this._routes = [...this._routes];
    }
  }

  /**
   * Sets the currently selected route.
   * @param route The route to select, or undefined to select no route.
   */
  public setSelectedRoute(route: Route | undefined): void {
    this.selectedRoute = route;
    this.selectedRouteId = route ? route.id : undefined;
    this.selectedRouteStopId = undefined;
  }


  /**
   * Starts polling for route data.
   * @returns A promise that will be resolved when the initial request succeedes.
   */
  public async startPolling() {
    const restart = this.polling;
    if (!restart) {
      this.loading = true;
    } else {
      if (this._routes == null) {
        // Do not restart before routes exist
        this.loading = true;
        this.polling = true;
        return;
      }
    }

    this.polling = true;
    this.paused = false;
    this.poll();
  }

  /**
   * Stops polling for route data.
   */
  public stopPolling(): void {
    this.loading = false;
    this.polling = false;
    this.pausePolling();
  }

  /**
   * Stops polling for route data.
   */
  public pausePolling(): void {
    clearTimeout(this.pollTimeout);
    this.paused = true;
  }

  public setNotInFocus() {
    this.pollInterval = pollIntervalOutOfFocus;
  }

  public setInFocus() {
    this.pollInterval = pollIntervalFocus;
  }

  public summary(route: Route): string {
    if (route.status.slug === "in-progress") {
      let stop = route.currentStop;
      let stopNumber = stop.stopNumber.toString();

      if (stop.status.slug === "arrived") {
        return Localization.sharedValue("Route_Summary_ArrivedAtStop")
               .replace("{number}", stopNumber);
      } else {
        return Localization.sharedValue("Route_Summary_EnRouteToStop")
               .replace("{number}", stopNumber);
      }
    } else {
      return route.status.name;
    }
  }

  /**
   * Fetches the tracked routes, then schedules the next poll.
   * @returns A promise that will be resolved when the poll succeedes.
   */
  private async poll(): Promise<void> {
    clearTimeout(this.pollTimeout);
    this.pollSession++;

    try {
      const pollSession = this.pollSession;
      const routes = await this.fetch();

      // The model creation already takes a while, primarily due to less than optimal date parsing in Luxon.
      // To avoid blocking the UI thread for too long, we therefore do the assignments to observable properties
      // within a timeout, thus deferring the react rendering process.
      return new Promise<void>((resolve, reject) => {
        setTimeout(async () => {
          try {
            if (pollSession !== this.pollSession) {
              return;
            }

            this.migrateRouteState(routes);

            this._routes = routes;

            if (this.selectedRouteId != null) {
              const selectedRoute = this._routes.find(r => r.id === this.selectedRouteId);

              if (selectedRoute != null) {
                this.selectedRoute = selectedRoute;
              }
            }

            this.loading = false;

            resolve();

          } catch (error) {
            reject(error);
          } finally {
            if (!this.paused) {
              this.pollTimeout = setTimeout(() => this.poll(), this.pollInterval);
            }
          }
        });
      });

    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error("An error occurred while polling for live tracking data.\n", error);
      this.pollTimeout = setTimeout(() => this.poll(), this.pollInterval);
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
  private async fetch(): Promise<Route[]> {
    let routes: Route[];
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
        routes.push(new Route(route));
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error("An error occurred while instantiating a live tracking route.\n", error, route);
      }
    }

    return routes;
  }

  /**
   * Migrates the client-side state of the routes by migrating it to the corresponding new routes.
   * @param newRoutes The new routes, just fetched from the server.
   */
  private migrateRouteState(newRoutes: Route[]): void {
    if (this._routes != null) {
      for (const newRoute of newRoutes) {
        const oldRoute = this._routes.find(r => r.id === newRoute.id);
        if (oldRoute != null) {
          oldRoute.migrateState(newRoute);
        }
      }
    }
  }

  onSelectDriver(driver: Driver) {
    let index = this.selectedDrivers.indexOf(driver);
      if (index != -1) {
        this.selectedDrivers.splice(index, 1);
      } else {
        this.selectedDrivers.push(driver);
      }
  }
}
