import { Duration } from "luxon";
import { Parameters } from "shared/src/model/logistics/routePlanning/settings";

export class RouteSimulationResult {

  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.id = data.id;
    this.summaries = data.summaries.map(r => new RoutePlanSummary(r));
  }

  public readonly id: string;
  public readonly summaries: RoutePlanSummary[];
}

export class RoutePlanSummary {

  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.routePlanId = data.routePlanId;
    this.parameters = new Parameters(data.parameters);

    if (data.metrics != null) {
      this.metrics = new RoutePlanMetrics(data.metrics);
    }
  }

  public readonly routePlanId: string;
  public readonly parameters: Parameters;
  public readonly metrics?: RoutePlanMetrics;
}

export class RoutePlanMetrics {

  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.totalTime = Duration.fromObject({ seconds: data.totalTime });
    this.routeCount = data.routeCount;
    this.stopPerHour = data.stopPerHour;
    this.colliPerRoute = data.colliPerRoute;
    this.stopPerRoute = data.stopPerRoute;
  }

  public readonly totalTime: Duration;
  public readonly routeCount: number;
  public readonly stopPerHour: number;
  public readonly colliPerRoute: number;
  public readonly stopPerRoute: number;
}