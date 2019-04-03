import { observable, computed } from "mobx";

export class Vehicle {

  /* tslint:disable-next-line: no-any */
  public constructor(data?: any) {
    if (data != null) {
      this.id = data.id;
      this.type = data.type;
      this.make = data.make;
      this.model = data.model;
      this.color = data.color;
      this.year = data.year;
      this.licensePlate = data.licensePlate;
    }
  }

  @observable
  public id: number;

  @observable
  public licensePlate: string;

  @observable
  public type: string;

  @observable
  public make: string;

  @observable
  public model: string;

  @observable
  public color: string;

  @observable
  public year: number;

  @computed
  public get isValid(): boolean {
    return !!(
      this.licensePlate &&
      this.type &&
      this.make &&
      this.model &&
      this.color &&
      this.year
    );
  }
}
