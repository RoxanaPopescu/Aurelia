import { observable } from "mobx";
import { DriverInfo } from "shared/src/components/routes/details/routeDispatchService";
import { RouteDispatchService } from "shared/src/components/routes/details/routeDispatchService";

export class DriverListStore {
  private routeDispatchService = new RouteDispatchService();

  @observable
  loading: boolean = true;

  @observable
  error?: string;

  @observable
  driverInfo: DriverInfo[] = [];

  async fetch() {
    try {
      this.driverInfo = await this.routeDispatchService.getDrivers();
      this.loading = false;
    } catch (e) {
      this.error = e.message;
      this.loading = false;
    }
  }
}
