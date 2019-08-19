import { Phone } from "../../general/phone";
import { VehicleType } from "../../session";

export class Driver {
  public id: number;
  public firstName: string;
  public lastName: string;
  public phone: Phone;
  public vehicleTypes?: VehicleType[];
  public company?: { name: string; id: string };

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.id = json.id;
    this.firstName = json.name.first;
    this.lastName = json.name.last;
    this.phone = new Phone(json.phone);
    this.vehicleTypes = json.vehicleTypeIds
      ? json.vehicleTypeIds.map(v => VehicleType.get(v))
      : undefined;
    this.company = json.company
      ? { name: json.company.name, id: json.company.id }
      : undefined;
  }

  get formattedName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
