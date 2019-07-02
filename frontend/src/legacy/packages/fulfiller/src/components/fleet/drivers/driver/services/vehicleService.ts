import { observable, computed } from "mobx";
import { Vehicle } from "../models/vehicle";
import BaseService from "shared/src/services/base";

export class VehicleService {

  public constructor(driverId?: number) {
    if (driverId != null) {
      this.loadVehicles(driverId);
    } else {
      this._vehicles = [];
    }
  }

  @observable
  private _busy: boolean = false;
  
  @observable
  private _vehicles: Vehicle[];
  
  @computed
  public get busy(): boolean {
    return this._busy;
  }
  
  @computed
  public get vehicles(): ReadonlyArray<Vehicle> {
    return this._vehicles;
  }

  public async addVehicle(vehicle: Vehicle, driverId: number): Promise<void> {
    this._busy = true;
    const response = await fetch(
      BaseService.url("drivers/addvehicle"),
      BaseService.defaultConfig({ driverId: driverId, vehicle: vehicle })
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not add vehicle.");
    }

    const data = await response.json();

    this._vehicles.push(new Vehicle(data));
    this._busy = false;
  }

  public async removeVehicle(vehicle: Vehicle, driverId: number): Promise<void> {
    this._busy = true;
    const response = await fetch(
      BaseService.url("drivers/deletevehicle"),
      BaseService.defaultConfig({ driverId: driverId, vehicleId: vehicle.id })
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not save vehicle.");
    }

    this._vehicles.splice(this._vehicles.indexOf(vehicle), 1);
    this._busy = false;
  }

  private async loadVehicles(driverId: number): Promise<void> {
    this._busy = true;

    const response = await fetch(
      BaseService.url("drivers/vehicles", { id: driverId.toString() }),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not get vehicles.");
    }

    const data = await response.json();

    this._vehicles = data.map(v => new Vehicle(v));
    this._busy = false;
  }
}
