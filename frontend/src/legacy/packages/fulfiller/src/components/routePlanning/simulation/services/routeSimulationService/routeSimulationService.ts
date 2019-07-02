import BaseService from "shared/src/services/base";
import { RouteSimulationInfo } from "./models/routeSimulationInfo";
import { RouteSimulationStart } from "./models/routeSimulationStart";
import { RouteSimulationResult } from "./models/routeSimulationResult";
import { Parameters } from "shared/src/model/logistics/routePlanning/settings";

export class RouteSimulationService {

  public async createSimulation(routePlanId: string): Promise<RouteSimulationStart> {
    const response = await fetch(
      BaseService.url("routeplanning/simulations/settings", { routePlanId: routePlanId }),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      throw new Error("Could not get route plan settings.");
    }

    const data = await response.json();

    return new RouteSimulationStart({
      routePlanId: routePlanId,
      parameters: new Parameters(data)
    });
  }

  public async startSimulation(simulation: RouteSimulationStart): Promise<void> {
    const response = await fetch(
      BaseService.url("routeplanning/simulations/start"),
      BaseService.defaultConfig(simulation)
    );

    if (!response.ok) {
      throw new Error("Could not start route simulation.");
    }
  }

  public async getSimulations(): Promise<RouteSimulationInfo[]> {
    const response = await fetch(
      BaseService.url("routeplanning/simulations/list"),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      throw new Error("Could not get route plan simulations.");
    }

    const data = await response.json();

    return data.map(s => new RouteSimulationInfo(s));
  }

  public async getSimulationResult(routeSimulationId: string): Promise<RouteSimulationResult> {
    const response = await fetch(
      BaseService.url("routeplanning/simulations/result", { id: routeSimulationId }),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      throw new Error("Could not get route simulation result.");
    }

    const data = await response.json();

    return new RouteSimulationResult(data);
  }
}

export const routeSimulationService = new RouteSimulationService();