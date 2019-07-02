import { observable } from "mobx";

/**
 * Represents the limitations to be taken into account when planning a route.
 */
export class Limitations {
  // tslint:disable-next-line:no-any
  constructor(data: any = undefined) {
    if (data) {
      this.maximumColliCount = data.maximumColliCount;
      this.maximumTimePerRoute = data.maximumTimePerRoute;
      this.maximumWeight = data.maximumWeight;
      this.maximumStopPerRouteCount = data.maximumStopPerRouteCount;
      this.maximumRoutesCount = data.maximumRoutesCount;
      this.startCostOfAdditionalRoute = data.startCostOfAdditionalRoute;
      this.vehicleShouldReturnToPickup = data.vehicleShouldReturnToPickup;
      this.oneRoutePlanningPerPickup = data.oneRoutePlanningPerPickup;
    } else {
      this.vehicleShouldReturnToPickup = false;
      this.oneRoutePlanningPerPickup = false;
    }
  }

  /**
   * The maximum amount of colli
   */
  @observable
  public maximumColliCount?: number;

  /**
   * The maximum time for each route
   */
  @observable
  public maximumTimePerRoute?: number;

  /**
   * The maximum weight
   */
  @observable
  public maximumWeight?: number;

  /**
   * The maximum amount of stops for all routes
   */
  @observable
  public maximumStopPerRouteCount?: number;

  /**
   * The maximum amount of routes
   */
  @observable
  public maximumRoutesCount?: number;

  /**
   * The cost of additional routes. The higher this number the less drivers are needed.
   */
  @observable
  public startCostOfAdditionalRoute?: number;

  /**
   * Should the routeplan return to the initial stop
   */
  @observable
  public vehicleShouldReturnToPickup?: boolean;

  /**
   * Can more routeplans be created for the same pickup?
   */
  @observable
  public oneRoutePlanningPerPickup?: boolean;

  public validate(): boolean {
    if (
      !this.maximumColliCount ||
      !this.maximumTimePerRoute ||
      !this.maximumWeight ||
      !this.maximumStopPerRouteCount ||
      !this.maximumRoutesCount ||
      !this.startCostOfAdditionalRoute
    ) {
      return false;
    }

    return true;
  }
}
