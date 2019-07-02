import { observable, computed } from "mobx";
import BaseService from "shared/src/services/base";
import { Driver } from "../models/driver";

export class DriverService {

  public constructor(driverId?: number) {
    if (driverId != null) {
      this.loadDriver(driverId);
    } else {
      this._driver = new Driver();
    }
  }
  
  @observable
  private _busy: boolean = false;
  
  @observable
  private _driver: Driver;
  
  @computed
  public get busy(): boolean {
    return this._busy;
  }
  
  @computed
  public get driver(): Driver {
    return this._driver;
  }

  public async deleteDriver(): Promise<void> {
    const response = await fetch(
      BaseService.url("drivers/delete"),
      BaseService.defaultConfig({ id: this._driver.id })
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not delete driver.");
    }
  }

  public async saveDriver(): Promise<void> {
    this._busy = true;

    const endpointUrl = this._driver.id != null ?
      "drivers/update" :
      "drivers/create";

    const response = await fetch(
      BaseService.url(endpointUrl),
      BaseService.defaultConfig(this._driver)
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not save driver.");
    }

    const data = await response.json();
    this._driver = new Driver(data);
    this._busy = false;
  }

  private async loadDriver(driverId: number): Promise<void> {
    this._busy = true;

    const response = await fetch(
      BaseService.url("drivers/details", { id: driverId.toString() }),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not get driver.");
    }

    const data = await response.json();

    this._driver = new Driver(data);
    this._busy = false;
  }
}
