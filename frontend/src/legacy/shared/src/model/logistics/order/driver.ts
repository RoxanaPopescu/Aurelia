import { Phone } from "../../general/phone";

export class Driver {
  public id: string;
  public firstName: string;
  public lastName: string;
  public phoneNumber: Phone;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.id = json.id;
    this.firstName = json.name.first;
    this.lastName = json.name.last;
    this.phoneNumber = new Phone(json.phone);
  }
}
