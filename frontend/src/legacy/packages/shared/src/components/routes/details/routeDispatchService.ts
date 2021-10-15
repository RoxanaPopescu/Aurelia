import BaseService from "shared/src/services/base";
import { Driver } from "shared/src/model/logistics/driver";
import { Route } from "../../../model/logistics/routes/details";
import { VehicleType } from "app/model/vehicle";

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

    return data.map(f => new DriverInfo(f));
  }

  public async assignDriver(route: Route, driver: Driver): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/route/assignDriver"),
      BaseService.defaultConfig({ routeId: route.id, driverId: driver.id })
    );

    if (!response.ok) {
      throw new Error("Could not assign the driver to the route.");
    }

    route.driver = driver;
  }
}

export const routeDispatchService = new RouteDispatchService();
