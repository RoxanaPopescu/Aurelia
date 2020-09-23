import BaseService from "shared/src/services/base";
import { Driver } from "app/model/driver";
import { VehicleType } from "app/model/vehicle";
import { Route, RouteStop } from "app/model/route";

export class DriverInfo {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.driver = new Driver(data.driver);
    this.vehicleTypes = data.vehicleTypeIds.map(id => VehicleType.get(id));
  }

  public readonly driver: Driver;

  public readonly vehicleTypes: VehicleType[];
}

export class RouteSplitService {
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
      throw new Error("Could not fetch drivers.");
    }

    const data = await response.json();

    return data.map(f => new DriverInfo(f));
  }

  public async splitRoute(
    route: Route,
    vehicleTypeId: string,
    selectedDriverId: string,
    selectedStopIds: string[]
  ): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/route/split"),
      BaseService.defaultConfig({
        routeId: route.id,
        routeStopIds: selectedStopIds,
        vehicleTypeId: vehicleTypeId,
        driverId: Number(selectedDriverId)
      })
    );

    if (!response.ok) {
      throw new Error("Could not split route.");
    }

    await response.json();

    // Remove stops
    let stops: RouteStop[] = [];
    for (let stop of route.stops) {
      if (stop instanceof RouteStop && !selectedStopIds.some(id => id === stop.id)) {
        stops.push(stop);
      }
    }

    route.stops = stops;
  }
}
