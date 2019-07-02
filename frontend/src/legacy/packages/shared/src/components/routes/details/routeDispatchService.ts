import BaseService from "shared/src/services/base";
import { Driver } from "shared/src/model/logistics/driver";
import { VehicleType } from "shared/src/model/logistics/vehicleType";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { Route } from "../../../model/logistics/routes/details";
import { RouteStatus } from "shared/src/model/logistics/routes";

export class DriverInfo {

  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.driver = new Driver(data.driver);
    this.vehicleTypes = data.vehicleTypeIds.map(id => VehicleType.get(id));
  }

  public readonly driver: Driver;

  public readonly vehicleTypes: VehicleType[];
}

export class RouteDispatchService {

  public async getDrivers(vehicleTypeId?: string): Promise<DriverInfo[]> {
    let items: { [Key: string]: string } = {};
    
    if (vehicleTypeId) {
      items.vehicleTypeId = vehicleTypeId;
    }

    const response = await fetch(
      BaseService.url("drivers/list", items),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      throw new Error("Could not get the list of drivers.");
    }

    const data = await response.json();

    return data.map(f => new DriverInfo(f))
      .filter(driverInfo => driverInfo.vehicleTypes.length > 0);
  }

  public async assignDriver(route: Route, driver: Driver): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/route/assignDriver"),
      BaseService.defaultConfig({ routeId: route.id, driverId: driver.id.toString() })
    );

    if (!response.ok) {
      throw new Error("Could not assign the driver to the route.");
    }

    route.driver = driver;
    route.status = new RouteStatus("assigned");
    route.allowAssignment = false;
  }

  public async getFulfillers(): Promise<Fulfiller[]> {
    const response = await fetch(
      BaseService.url("dispatch/getFulfillers"),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      throw new Error("Could not get the list of fulfillers.");
    }

    const data = await response.json();

    return data.map(f => new Fulfiller(f));
  }

  public async assignFulfiller(route: Route, fulfiller: Fulfiller): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/route/assignFulfiller"),
      BaseService.defaultConfig({
        routeId: route.id,
        fulfillerId: fulfiller.id,
        currentFulfillerId: route.fulfiller.id
      })
    );

    if (!response.ok) {
      throw new Error("Could not assign the fulfiller to the route.");
    }

    route.fulfiller = fulfiller;
    route.allowAssignment = false;
  }
}

export const routeDispatchService = new RouteDispatchService();
