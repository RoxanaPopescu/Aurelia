import { observable, computed } from "mobx";
import { Container } from "aurelia-framework";
import BaseService from "shared/src/services/base";
import Localization from "shared/src/localization";
import { routeFlagService } from "./routeFlagService";
import { Driver } from "app/model/driver";
import { RouteService, Route, RouteInfo, RouteStatus, RouteStatusSlug, RouteStopBase } from "app/model/route";
import { LiveTrackingFilter } from "./liveTrackingFilter";
import { DateTime, Duration } from "luxon";
import { CommunicationService } from "app/model/_communication";
import { ToastType } from "shared/src/webKit";
import { Log } from "shared/infrastructure";
import { TeamsFilterService } from "app/services/teams-filter";

const routeStatusSortOrder: (keyof typeof RouteStatus.values)[] =
  ["not-started", "in-progress", "not-approved", "completed", "cancelled"];

const pollIntervalDetailsFocus = 3500;
const pollIntervalFocus = 7000;
const pollIntervalOutOfFocus = 120000;

type ListType = "not-started" | "in-progress" | "no-driver";

/**
 * Represents a service that manages the routes shown in live tracking.
 */

export class LiveTrackingService {
  constructor(routeService: RouteService, communicationService: CommunicationService) {
    this.routeService = routeService;
    this.communicationService = communicationService;
    this.startPolling();

    console.log(this.communicationService);
  }

  public routeService: RouteService;
  public communicationService: CommunicationService;

  /* tslint:disable-next-line: no-any */
  private pollTimeout: { notStarted: any, inProgress: any, noDriver: any, selectedRoute: any } = {
    notStarted: undefined,
    inProgress: undefined,
    noDriver: undefined,
    selectedRoute: undefined
  };

  @observable
  public toast?: { type: ToastType.Success, content: string };

  public pollInterval = pollIntervalFocus;
  public pollIntervalDetails = pollIntervalDetailsFocus;

  @observable
  private routesNotStarted: RouteInfo[] | undefined;

  @observable
  private routesInProgress: RouteInfo[] | undefined;

  @observable
  private routesNoDriver: RouteInfo[] | undefined;

  @observable
  drivers: Driver[] | undefined;

  @observable
  selectedDrivers: Driver[] = [];

  @observable
  onlineDrivers: Driver[] | undefined;

  /**
   * True if the service is stopped
   */
  private stopped = false;

  /**
   * True if the service is loading drivers in the area
   */
  @observable
  public loadingDriversInArea = false;

  /**
   * True if the details polling is stopped
   */
  private stoppedDetails = true;

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
  public selectedRouteSlug: string | undefined;

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
    if (this.routesNotStarted != null &&
        this.routesInProgress != null &&
        this.routesNoDriver != null) {
      return true;
    }

    return false;
  }

  @computed
  get selectedListRoute(): RouteInfo | undefined {
    let slug = this.selectedRouteSlug;
    if (!slug) {
      return undefined;
    }

    return this.routes.find(r => r.slug == slug);
  }

  @computed
  get routes(): RouteInfo[] {
    let routes: RouteInfo[] = [];

    if (this.routesNotStarted != null) {
      routes = routes.concat(this.routesNotStarted);
    }

    if (this.routesInProgress != null) {
      routes = routes.concat(this.routesInProgress);
    }

    if (this.routesNoDriver != null) {
      routes = routes.concat(this.routesNoDriver);
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

    if (routes.length <= 0) {
      return [];
    }

    if (this.filter.searchQuery == null &&
        this.filter.assignedToDriver == null &&
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

        if (this.filter.assignedToDriver != null) {
          if (route.driver == null && this.filter.assignedToDriver) {
            return false;
          } else if (route.driver != null && !this.filter.assignedToDriver) {
            return false;
          }
        }

        return route.searchModel.contains(this.filter.searchQuery);
      })
  }

  /**
   * Calculates the summary of the route
   */
  public summary(route: RouteInfo): string {
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
  public setSelectedRouteSlug(slug: string | undefined): void {
    this.selectedRouteSlug = slug;
    this.selectedRouteStopId = undefined;

    if (slug == null) {
      this.stoppedDetails = true;
      this.selectedRoute = undefined;
      clearImmediate(this.pollTimeout.selectedRoute);
    } else {
      this.stoppedDetails = false;
      this.pollDetails();
    }
  }

  public async sendSms(driver: Driver) {
    const message = prompt(`${Localization.sharedValue("Livetracking_Driver_Message")} ${driver.name} (${driver.id})`);

    if (message != null && message != "") {
      try {
        await this.communicationService.sendSms(message, driver.phone);

        const toastContent = Localization.sharedValue("Livetracking_Driver_Message_Sent")
          .replace("{message}", message)
          .replace("{driver}", `${driver.name} (${driver.id})`);

        this.toast = { type: ToastType.Success, content: toastContent }
      } catch (error) {
        Log.error(error);
      }
    }
  }

  /**
   * Starts polling for route data.
   * @returns A promise that will be resolved when the initial request succeedes.
   */
  private async startPolling() {
    this.stopped = false;

    clearTimeout(this.pollTimeout.inProgress);
    clearTimeout(this.pollTimeout.noDriver);
    clearTimeout(this.pollTimeout.notStarted);
    clearTimeout(this.pollTimeout.selectedRoute);

    this.poll("in-progress");
    this.poll("no-driver");
    this.poll("not-started");
    this.pollDetails();
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
    this.pollIntervalDetails = pollIntervalOutOfFocus;
  }

  public setInFocus() {
    this.pollInterval = pollIntervalFocus;
    this.pollIntervalDetails = pollIntervalDetailsFocus;

    // Force one poll
    this.startPolling();
  }

  /**
   * Fetches the selected detail route
   */
  private async pollDetails() {
    clearTimeout(this.pollTimeout.selectedRoute);

    if (!this.selectedRouteSlug) {
      return;
    }

    try {
      const result = await this.routeService.get(this.selectedRouteSlug);

      if (this.selectedRouteSlug && this.selectedRouteSlug == result.slug) {

        // Migrate stops if needed
        if (this.selectedRoute != null) {
          for (let stop of result.stops) {
            if (stop instanceof RouteStopBase) {
              let foundStop = this.selectedRoute.stops.find(s => s.id == stop.id);
              if (foundStop != null && foundStop instanceof RouteStopBase) {
                stop.selected = foundStop.selected;
              }
            }
          }
        }

        this.selectedRoute = result;
      }
    } catch (error) {
      // We do nothing
    } finally {
      if (this.stoppedDetails) {
        return;
      }

      this.pollTimeout.selectedRoute = setTimeout(() => this.pollDetails(), this.pollIntervalDetails);
    }
  }

  async fetchOnlineDrivers(northEast: google.maps.LatLng, southWest: google.maps.LatLng) {
    this.loadingDriversInArea = true;

    let body = {
      "northEastPosition": { "latitude": northEast.lat(), "longitude": northEast.lng() },
      "southWestPosition": { "latitude": southWest.lat(), "longitude": southWest.lng() },
      "vehicleTypes": this.filter.vehicleTypeIds
    };

    const response = await fetch(
      BaseService.url("drivers/online-in-area", undefined, "v2"),
      BaseService.defaultConfig(body)
    );

    this.loadingDriversInArea = false;

    if (!response.ok) {
      throw new Error("Could not fetch drivers.");
    }

    const data = await response.json();
    this.onlineDrivers = data.results.map(r => new Driver(r));
  }

  /**
   * Fetches the tracked routes, then schedules the next poll.
   */
  private async poll(type: ListType) {
    if (type == "in-progress") {
      clearTimeout(this.pollTimeout.inProgress);
    } else if (type == "no-driver") {
      clearTimeout(this.pollTimeout.noDriver);
    } else if (type == "not-started") {
      clearTimeout(this.pollTimeout.notStarted);
    }

    try {
      let statuses: RouteStatusSlug[];
      let from = DateTime.local();
      let to = DateTime.local();
      let assignedDriver: boolean | undefined;

      if (type == "in-progress") {
        statuses = ["in-progress"];
        from = from.minus(Duration.fromObject({hours: 48}));
        to = to.plus(Duration.fromObject({hours: 12}));
      } else if (type == "no-driver") {
        statuses = ["not-started", "not-approved"];
        assignedDriver = false;
        from = from.minus(Duration.fromObject({hours: 6}));
        to = to.plus(Duration.fromObject({hours: 3}));
      } else {
        statuses = ["not-started"];
        assignedDriver = true;
        from = from.minus(Duration.fromObject({hours: 2}));
        to = to.plus(Duration.fromObject({hours: 3}));
      }

      const result = await this.routeService.getAll(
          {
              statuses: statuses,
              startTimeFrom: from.toUTC(),
              startTimeTo: to.toUTC(),
              assignedDriver: assignedDriver,
              teams: Container.instance.get(TeamsFilterService)?.selectedTeamIds
          },
          {
              owner: true,
              vehicle: true,
              fulfiller: true,
              driver: true,
              tags: true,
              criticality: true,
              estimates: true,
              stops: true,
              driverPosition: true
          },
          undefined,
          { page: 1, pageSize: 300 }
      );

      if (type == "in-progress") {
        this.routesInProgress = result.routes;
      } else if (type == "no-driver") {
        this.routesNoDriver = result.routes;
      } else {
        this.routesNotStarted = result.routes;
      }

    } catch (error) {
      // Do not resolve errors yet.
    } finally {
      if (!this.stopped) {
        if (type == "in-progress") {
          this.pollTimeout.inProgress = setTimeout(() => this.poll(type), this.pollInterval);
        } else if (type == "no-driver") {
          this.pollTimeout.noDriver = setTimeout(() => this.poll(type), this.pollInterval);
        } else if (type == "not-started") {
          this.pollTimeout.notStarted = setTimeout(() => this.poll(type), this.pollInterval);
        }
      }
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

  onSelectDriver(driver: Driver) {
    let index = this.selectedDrivers.indexOf(driver);
      if (index != -1) {
        this.selectedDrivers.splice(index, 1);
      } else {
        this.selectedDrivers.push(driver);
      }
  }
}
