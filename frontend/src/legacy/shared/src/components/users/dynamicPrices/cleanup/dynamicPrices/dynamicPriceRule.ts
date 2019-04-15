import { observable, computed } from "mobx";
import { VehicleType } from "../rules";
import { GUID } from "shared/src/utillity/guid";
import { DynamicPriceType } from "./enums/dynamicPriceType";
import { DynamicPriceTemplate } from "./enums/dynamicPriceTemplate";

export class SingleRule {
  id = GUID.generate();
  title: string;
  type: DynamicPriceType;

  constructor(type: DynamicPriceType) {
    this.type = type;
    this.title = DynamicPriceType.title(type);
  }
}

export class StoreVehicle {
  type: VehicleType;
  title: string;
  addTitle: string;
  @observable
  enabled: boolean;

  constructor(type: VehicleType, title: string, addTitle: string) {
    this.type = type;
    this.title = title;
    this.addTitle = addTitle;
    this.enabled = true;
  }
}

export class SinglePriceStore {
  rulesToAdd: DynamicPriceType[] = [
    DynamicPriceType.Zones,
    DynamicPriceType.StartPrice,
    DynamicPriceType.PriceEachKm,
    DynamicPriceType.HourPrice,
    DynamicPriceType.MinimumPrice,
    DynamicPriceType.ExtraPriceStops,
    DynamicPriceType.AdditionalKmPrice,
    DynamicPriceType.TimeInterval,
    DynamicPriceType.LoadingPrice,
    DynamicPriceType.LoadingInclusive,
    DynamicPriceType.LoadingInclusivePickup,
    DynamicPriceType.LoadingInclusiveDelivery
  ];

  @observable
  addingRule: boolean = false;

  @observable
  selectedRule?: SingleRule;

  @observable
  vehicles: StoreVehicle[] = [
    new StoreVehicle(VehicleType.Car, "Car", "Add car"),
    new StoreVehicle(VehicleType.Van, "Van", "Add van"),
    new StoreVehicle(VehicleType.Lift, "Lift", "Add lift")
  ];

  @observable
  items: SingleRule[] = [];

  constructor(template?: DynamicPriceTemplate) {
    if (template !== undefined) {
      for (let ruleType of DynamicPriceTemplate.rules(template)) {
        this.addRule(ruleType);
      }
    }
  }

  addRule(type: DynamicPriceType) {
    this.items.push(new SingleRule(type));
    this.updateZoneTitlesIfNeeded();
  }

  removeVehicle(vehicle: StoreVehicle) {
    this.vehicles.forEach(_vehicle => {
      if (_vehicle.type === vehicle.type) {
        vehicle.enabled = false;
      }
    });

    this.sortVehicles();
  }

  enableVehicle(vehicle: StoreVehicle) {
    vehicle.enabled = true;
    this.sortVehicles();
  }

  removeRule(rule: SingleRule) {
    let foundIndex: number | undefined = undefined;
    this.items.forEach((_rule, index) => {
      if (_rule.id === rule.id) {
        foundIndex = index;
      }
    });

    if (foundIndex !== undefined) {
      this.items.splice(foundIndex, 1);
    }

    this.updateZoneTitlesIfNeeded();
  }

  private updateZoneTitlesIfNeeded() {
    let zoneCount = 0;
    this.items.forEach(rule => {
      if (rule.type === DynamicPriceType.Zones) {
        zoneCount++;
        rule.title = "Zone " + zoneCount;
      }
    });
  }

  private sortVehicles() {
    // Sort by active first, then inactive
    let vehicles: StoreVehicle[] = [];
    let inactiveVehicles: StoreVehicle[] = [];

    this.vehicles.forEach(vehicle => {
      if (vehicle.enabled) {
        vehicles.push(vehicle);
      } else {
        inactiveVehicles.push(vehicle);
      }
    });

    vehicles.sort(
      (a, b) => (VehicleType.order(a.type) >= VehicleType.order(b.type) ? 1 : 0)
    );

    this.vehicles = vehicles.concat(inactiveVehicles);
  }

  @computed
  public get enabledVehicles(): number {
    let enabled: number = 0;
    this.vehicles.forEach(vehicle => {
      if (vehicle.enabled) {
        enabled++;
      }
    });

    return enabled;
  }
}
