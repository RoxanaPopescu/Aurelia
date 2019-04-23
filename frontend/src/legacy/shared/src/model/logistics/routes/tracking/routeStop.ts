import { RouteStop as RouteStopBase } from "../routeStop";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class RouteStop extends RouteStopBase {
  
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, stopNumber: number) {
    
    super(data, stopNumber);

    this.orderIds = data.orderIds;
  }

  /**
   * The order ID's for the pickups and deliveries to be completed at this stop.
   */
  public orderIds: string[];
}
