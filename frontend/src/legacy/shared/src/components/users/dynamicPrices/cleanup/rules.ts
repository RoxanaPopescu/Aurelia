import { observable } from "mobx";

export enum VehicleType {
  Car = 139,
  Van = 2,
  Lift = 140
}

export namespace VehicleType {
  export function order(vehicle: VehicleType): number {
    // tslint:disable-next-line:switch-default
    switch (vehicle) {
      case VehicleType.Car:
        return 0;
      case VehicleType.Van:
        return 1;
      case VehicleType.Lift:
        return 2;
    }
  }
}

export enum ActionType {
  RoutePrice = 0,
  HourPrice = 1,
  StopPrice = 2
}

export interface RuleAction {
  name: string;
  description: string;
  type: ActionType;
}

export class RuleSet {
  @observable vehicleType: VehicleType;

  @observable validPeriod: string | undefined;

  @observable actions: RuleAction[] = [];

  addAction(name: string) {
    let action2 = name;
    name = action2;

    // this.actions.push({ name: 'Rule: ' + (this.actions.length + 1).toString() });
  }

  removeAction(index: number) {
    this.actions.splice(index, 1);
  }
}

export class AppState {
  @observable rules: RuleSet[] = [new RuleSet()];

  addRuleSet() {
    this.rules.push(new RuleSet());
  }
}
