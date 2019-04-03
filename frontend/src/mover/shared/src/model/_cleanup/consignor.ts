import { Location } from "shared/src/model/general/location";

export default class Consignor {
  id: string;
  name: string;
  phone: string;
  location: Location;

  // tslint:disable-next-line:no-any
  constructor(name: string, phone: string, location: Location, id: string) {
    this.name = name;
    this.phone = phone;
    this.location = location;
    this.id = id;
  }
}
