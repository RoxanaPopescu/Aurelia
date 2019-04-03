import BaseService from "shared/src/services/base";
import { Driver } from "shared/src/model/logistics/driver";
import { VehicleType } from "shared/src/model/logistics/vehicleType";
import { Route } from "shared/src/model/logistics/routes/tracking";

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
    selectedDriverId: number,
    selectedStopIds: string[]
  ): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/route/split"),
      BaseService.defaultConfig({
        routeId: route.id,
        routeStopIds: selectedStopIds,
        vehicleTypeId: vehicleTypeId,
        driverId: selectedDriverId
      })
    );

    if (!response.ok) {
      throw new Error("Could not split route.");
    }

    await response.json();

    // Remove the stops from the selected route.
    route.stops = route.stops.filter(
      s => !selectedStopIds.some(id => id === s.id)
    );

    // tslint:disable-next-line: max-line-length
    // TODO: We can't enable this feature before we update SplitRoute in BFF to return "Slug" & "Reference", also it might be buggy.
    // const data = await response.json();
    // route.relatedRoutes.push(data);
  }
}
