import { observable } from "mobx";
import { DateTime } from "luxon";
import BaseService from "shared/src/services/base";
import { DepotRoute } from "./depotRoute";
import { remarks } from "./data/depotRouteRemarks";

let currentSessionId = 0;
const pollIntervalFocus = 10000;
const pollIntervalOutOfFocus = 120000;

export class DepotRouteService {
  private paused = false;
  private depotId: string;
  private date: DateTime;
  public pollInterval = pollIntervalFocus;

  // tslint:disable-next-line:no-any
  private pollTimeoutHandle: any;

  @observable
  public routes: DepotRoute[] | undefined;

  public remarks = remarks;

  public startPolling(depotId: string, date: DateTime): void {

    this.stopPolling();

    this.routes = undefined;
    this.depotId = depotId;
    this.date = date;

    try {
      this.fetchRoutes(this.depotId, this.date);
    } catch {
      // Do nothing
    }
  }

  public setNotInFocus() {
    this.pollInterval = pollIntervalOutOfFocus;
  }

  public setInFocus() {
    clearTimeout(this.pollTimeoutHandle);
    this.pollInterval = pollIntervalFocus;

    // Force one poll
    this.resumePolling();
  }

  public stopPolling() {
    clearTimeout(this.pollTimeoutHandle);
  }

  public pausePolling() {
    this.stopPolling();
    this.paused = true;
  }

  public resumePolling() {
    this.paused = false;

    try {
      this.fetchRoutes(this.depotId, this.date);
    } catch {
      // Do nothing
    }
  }

  private fetchAfterDelay(): void {
    clearTimeout(this.pollTimeoutHandle);
    this.pollTimeoutHandle = setTimeout(() => {
      try {
        this.fetchRoutes(this.depotId, this.date);
      } catch {
        // Do nothing
      }
    }, this.pollInterval);
  }

  public async saveRoute(route: DepotRoute): Promise<void> {
    const response = await fetch(
      BaseService.url("distribution-centers/routes/save-remarks"),
      BaseService.defaultConfig({
        routeId: route.id,
        depotId: this.depotId,
        driverId: route.driverId,
        remarkCodes: route.remarks.map(r => r.code),
        note: route.note
      })
    );

    if (!response.ok) {
      throw new Error("Could not save route remarks.");
    }
  }

  private async fetchRoutes(depotId: string, date: DateTime): Promise<void> {
    if (this.paused) { return }

    const sessionId = currentSessionId;

    const fromDate = date
      .toISO({ includeOffset: false });

    const toDate = date
      .plus({ days: 1, milliseconds: -1 })
      .toISO({ includeOffset: false });

    const response = await fetch(
      BaseService.url("distribution-centers/routes/list", {
        distributionCenterId: depotId,
        fromDate: fromDate,
        toDate: toDate
      }),
      BaseService.defaultConfig()
    );

    if (this.paused) { return }
    this.fetchAfterDelay();

    if (sessionId !== currentSessionId) {
      return;
    }

    if (!response.ok) {

      // 500 errors we can't retry with
      if (response.status === 500)
      {
        this.pausePolling();
      }

      throw new Error("Request failed with status code " + response.status);
    }

    const data = await response.json();

    this.routes = data.map(route => new DepotRoute(route));
  }
}
