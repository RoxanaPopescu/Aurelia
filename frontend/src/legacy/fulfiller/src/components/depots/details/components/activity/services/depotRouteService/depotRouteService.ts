import { observable } from "mobx";
import { DateTime } from "luxon";
import BaseService from "shared/src/services/base";
import { DepotRoute } from "./depotRoute";
import { remarks } from "./data/depotRouteRemarks";

let currentSessionId = 0;

export class DepotRouteService {

  private depotId: string;
  private date: DateTime;

  // tslint:disable-next-line:no-any
  private pollIntervalHandle: any;

  @observable
  public routes: DepotRoute[] | undefined;

  public remarks = remarks;

  public startPolling(depotId: string, date: DateTime): void {

    this.stopPolling();

    this.routes = undefined;
    this.depotId = depotId;
    this.date = date;
    
    this.resumePolling();
  }

  public stopPolling(): void {
    currentSessionId++;
    clearInterval(this.pollIntervalHandle);
  }

  public pausePolling(): void {
    currentSessionId++;
    clearInterval(this.pollIntervalHandle);
  }

  public resumePolling(): void {
    this.fetchRoutes(this.depotId, this.date);
    this.pollIntervalHandle = setInterval(() => {
      try {
        this.fetchRoutes(this.depotId, this.date);
      } catch (error) {
        console.warn("Error: Could not get routes for depot.", error);
      }
    }, 10000);
  }

  public async saveRoute(route: DepotRoute): Promise<void> {
    const response = await fetch(
      BaseService.url("depots/routes/update"),
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

    const sessionId = currentSessionId;

    const fromDate = date
      .toISO({ includeOffset: false });

    const toDate = date
      .plus({ days: 1, milliseconds: -1 })
      .toISO({ includeOffset: false });

    const response = await fetch(
      BaseService.url("depots/routes/list", {
        depotId: depotId,
        fromDate: fromDate,
        toDate: toDate
      }),
      BaseService.defaultConfig()
    );

    if (sessionId !== currentSessionId) {
      return;
    }

    if (!response.ok) {
      throw new Error("Request failed with status code " + response.status);
    }

    const data = await response.json();

    this.routes = data.map(route => new DepotRoute(route));
  }
}