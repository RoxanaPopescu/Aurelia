import { observable } from "mobx";
import Localization from "shared/src/localization";
import BaseService from "shared/src/services/base";
import { Route } from "shared/src/model/logistics/routes/details";
import mockData from "./_mockData";
import { delay } from "shared/src/utillity/delay";
import { RouteStatus } from "app/model/route";

/**
 * Represents a service that manages the data for the route details view.
 */
export class RouteDetailsService {
  /* tslint:disable-next-line: no-any */
  private pollTimeout: any;
  private pollSession = 0;
  private routeSlug: string | undefined;
  private initialResultLoaded = false;
  private startAbortController: AbortController;

  /**
   * True if the service is loading the details for a route, otherwise false.
   * Note that this will only be true for the initial request for a route,
   * not while polling for updates.
   */
  @observable public loading = false;

  /**
   * The route details, which will be periodically updated.
   */
  @observable public routeDetails: Route | undefined;

  /**
   * True if the service is polling for route details, otherwise false.
   */
  @observable public polling = false;

  /**
   * Starts polling for details for the specified route.
   * @param routeSlug The slug identifying the route for which details should be fetched,
   * or undefined to resume polling using the most recent route route slug.
   * @param waitTime The time in milliseconds to wait before polling starts.
   * @returns A promise that will be resolved when the initial request succeedes.
   */
  public async startPolling(
    routeSlug?: string,
    waitTime?: number
  ): Promise<void> {
    this.stopPolling();
    if (waitTime) {
      this.startAbortController = new AbortController();
      await delay(waitTime, this.startAbortController.signal);
      return await this.startPolling(routeSlug);
    }

    if (this.initialResultLoaded === false) {
      this.loading = true;
    }
    this.polling = true;
    this.routeSlug = routeSlug || this.routeSlug;
    this.pollSession++;
    return await this.poll(this.routeSlug!, true);
  }

  /**
   * Stops polling for route details.
   */
  public stopPolling(reset: boolean = false): void {
    clearTimeout(this.pollTimeout);
    if (this.startAbortController != null) {
      this.startAbortController.abort();
    }
    this.loading = false;
    this.polling = false;
    this.pollSession++;
    if (reset) {
      this.initialResultLoaded = false;
    }
  }

  /**
   * Fetches the details for the specified route, then schedules the next poll.
   * @param routeSlug The slug identifying the route for which details should be fetched.
   * @returns A promise that will be resolved when the poll succeedes.
   */
  private async poll(routeSlug: string, initial: boolean): Promise<void> {
    const isDemo = location.hash === "#demo";

    clearTimeout(this.pollTimeout);

    try {
      const pollSession = this.pollSession;
      if (isDemo) {
        this.routeDetails = await this.fetchDemo(routeSlug);
      } else {
        this.routeDetails = await this.fetch(routeSlug);
      }
      if (pollSession !== this.pollSession) {
        return;
      }
      this.initialResultLoaded = true;
      this.loading = false;

      if (
        this.routeDetails.status.slug !== new RouteStatus("cancelled").slug &&
        this.routeDetails.status.slug !== new RouteStatus("completed").slug
      ) {
        this.pollTimeout = setTimeout(
          () => this.poll(routeSlug, false),
          isDemo ? 300 : 2000
        );
      }
    } catch (error) {
      this.pollTimeout = setTimeout(() => this.poll(routeSlug, false), 2000);
      if (initial) {
        throw error;
      }
    }
  }

  /**
   * Fetches the details for the demo route.
   * @param routeSlug The slug identifying the route for which details should be fetched.
   * @returns A promise that will be resolved with the details for the specified route.
   */
  private async fetchDemo(routeSlug: string): Promise<Route> {
    const data = JSON.parse(JSON.stringify(mockData));

    /* tslint:disable-next-line: no-any */
    if (!(window as any).driverAssigned) {
      delete data.driver;
    }

    // Move to next step.
    if (this.step < 80) {
      this.step++;
    }

    // Change state...

    if (this.step >= 10) {
      data.stops[2].status = "arrived";
    }

    if (this.step >= 15) {
      data.stops[2].status = "completed";

      data.stops[0].pickups[0].colli
        .filter(c => c.status === "picked-up")
        .forEach(c => (c.status = "delivered"));
      data.stops[2].deliveries[0].colli
        .filter(c => c.status === "picked-up")
        .forEach(c => (c.status = "delivered"));

      data.stops[2].pickups[0].colli.forEach(c => (c.status = "picked-up"));
      data.stops[2].pickups[1].colli.forEach(c => (c.status = "picked-up"));
      data.stops[3].deliveries[0].colli.forEach(c => (c.status = "picked-up"));
      data.stops[4].deliveries[0].colli.forEach(c => (c.status = "picked-up"));
    }

    if (this.step >= 30) {
      data.driverOnline = false;
    }

    if (this.step >= 35) {
      data.driverOnline = true;
    }

    if (this.step >= 35) {
      data.stops[3].isDelayed = true;
    }

    if (this.step >= 45) {
      data.stops[3].status = "cancelled-by-system";
      delete data.stops[3].arrivalTime;
    }

    if (this.step >= 70) {
      data.stops[4].status = "arrived";
    }

    if (this.step >= 80) {
      data.stops[4].deliveries[0].colli.forEach(c => (c.status = "delivered"));
      data.stops[4].status = "completed";
      data.status = "completed";
    }

    // Move the driver.
    const moveStep = Math.max(
      20,
      Math.min(
        68,
        this.step < 30 ? this.step : this.step < 35 ? 30 : this.step - 5
      )
    );
    data.driverPosition.latitude -= (moveStep - 20) * 0.0029;
    data.driverPosition.longitude -= (moveStep - 20) * 0.0047;

    return new Route(data);
  }

  /**
   * Fetches the details for the specified route.
   * @param routeSlug The slug identifying the route for which details should be fetched.
   * @returns A promise that will be resolved with the details for the specified route.
   */
  private async fetch(routeSlug: string): Promise<Route> {
    const response = await fetch(
      BaseService.url("routes/details", { routeSlug }),
      BaseService.defaultConfig()
    );

    if (response.status === 404) {
      const error = new Error(Localization.sharedValue("Error_RouteNotFound"));
      error.name = "not-found-error";
      throw error;
    }
    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    const data = await response.json();
    return new Route(data);
  }

  private step = 0;
}

export const routeDetailsService = new RouteDetailsService();
