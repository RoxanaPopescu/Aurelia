import { Route } from "./route";

export class RouteListResponseModel {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.routes = data.routes.map(route => new Route(route));
    this.totalCount = data.totalCount;
  }

  public routes: Route[];

  public totalCount: number;
}
