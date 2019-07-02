import { observable, computed } from "mobx";
import BaseService from "shared/src/services/base";
import Localization from "shared/src/localization";
import { Route } from "shared/src/model/logistics/routes/tracking";
import { RouteCriticality, RouteStatus } from "shared/src/model/logistics/routes";
import { routeFlagService } from "./routeFlagService";

const routeStatusSortOrder: (keyof typeof RouteStatus.map)[] = 
  ["requested", "accepted", "assigned", "started", "completed", "cancelled"];

/**
 * Represents the filters that determien which routes are shown in live tracking.
 */
export interface RouteFilter {

  /**
   * The criticality levels to include, or undefined to include all levels.
   */
  criticality?: (keyof typeof RouteCriticality.map)[];
}

/**
 * Represents a service that manages the routes shown in live tracking.
 */
export class RoutesService {

  /* tslint:disable-next-line: no-any */
  private pollTimeout: any;
  private pollSession = 0;
  
  @observable
  public _routes: Route[] | undefined;

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
   * The filters that determien which routes are shown in live tracking.
   */
  @observable
  public filter: RouteFilter = {};

  /**
   * The text filter to apply, or undefined to apply no text filter.
   */
  @observable
  public textFilter: string | undefined;

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
   * Sets the currently selected route.
   * @param route The route to select, or undefined to select no route.
   */
  public setFilter(filter: RouteFilter): void {
    this.filter = { ...this.filter, ...filter };
    this.startPolling();
  }

  /**
   * Starts polling for route data.
   * @returns A promise that will be resolved when the initial request succedes.
   */
  public async startPolling(): Promise<void> {
    const restart = this.polling;
    this.stopPolling();
    if (!restart) {
      this.loading = true;
    }
    this.polling = true;
    this.pollSession++;
    return this.poll();
  }

  /**
   * Stops polling for route data.
   */
  public stopPolling(): void {
    clearTimeout(this.pollTimeout);
    this.loading = false;
    this.polling = false;
    this.pollSession++;
  }
  
  /**
   * Fetches the tracked routes, then schedules the next poll.
   * @returns A promise that will be resolved when the poll succedes.
   */
  private async poll(): Promise<void> {
    clearTimeout(this.pollTimeout);

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
            this.pollTimeout = setTimeout(() => this.poll(), 7000);

            resolve();

          } catch (error) {
            reject(error);
          }
        });
      });

    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error("An error occurred while polling for live tracking data.\n", error);
      this.pollTimeout = setTimeout(() => this.poll(), 8000);
    }
  }

  /**
   * Fetches the tracked routes.
   * @returns A promise that will be resolved with the routes.
   */
  private async fetch(): Promise<Route[]> {
    const isDemo = location.hash === "#demo";

    let routes: Route[];
    
    if (isDemo) {
      routes = this.fetchDemo();
    } else {
      var url = "routes/tracking";

      const response = await fetch(
        BaseService.url(url),
        BaseService.defaultConfig({ ...this.filter })
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

  /**
   * Fetches the demo routes.
   * @returns A promise that will be resolved with the routes.
   */
  private fetchDemo(): Route[] {
    const second = new Date().getSeconds();
    const offset = (second % 10) / 50;
    
    const data = require("../_routesMockData.json");
    const result: Route[] = [];
    let lat = data[0].driverPosition.latitude;
    let lon = data[0].driverPosition.longitude;
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        let routeData = JSON.parse(JSON.stringify(data[0]));

        const driverOnline = x === 0 && y === 0 && second % 5 < 4 ? false : true;
        const criticality = !(y % 5 || x % 5) ? "high" : !(y % 2 || x % 2) ? "medium" : "low";

        if (criticality === "low") {
          for (const stop of routeData.stops) {
            stop.isDelayed = false;
          }
        }

        const status = x === 1 ? (y === 8 ? "cancelled" : "completed") : routeData.status;

        result.push(new Route({
          ...routeData,
          id: `${routeData.id}-r-00${x}-00${y}`,
          slug: `r-00${x}-00${y}`,
          status,
          completionTime: status !== "cancelled" ? routeData.completionTime : undefined,
          driverPosition: {
            latitude: lat - (y / 5) - offset,
            longitude: lon + (x / 2) - offset
          },
          driverOnline,
          criticality
        }));

      }
    }
    
    return result.filter(r =>
      this.filter.criticality == null ||
      this.filter.criticality.includes(r.criticality.slug));
  }
}