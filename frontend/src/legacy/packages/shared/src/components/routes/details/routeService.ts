import BaseService from "shared/src/services/base";

export class RouteService {

  public async reloadRouteInApp(routeId: string): Promise<void> {
    const response = await fetch(
      BaseService.url("routes/reloadRouteInApp"),
      BaseService.defaultConfig({
        routeId
      })
    );

    if (!response.ok) {
      throw new Error("Could not reload the route.");
    }
  }

  public async setStatus(routeId: string, status: string): Promise<void> {
    const response = await fetch(
      BaseService.url("routes/setRouteStatus"),
      BaseService.defaultConfig({
        routeId,
        status
      })
    );

    if (!response.ok) {
      throw new Error("Could not reload the route.");
    }
  }
}

export const routeService = new RouteService();
