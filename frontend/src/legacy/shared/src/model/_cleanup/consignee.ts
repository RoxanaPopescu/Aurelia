import { Location } from "shared/src/model/general/location";

export default class Consignee {
  name: string;
  companyName: string;
  phone: string;
  location: Location;

  // tslint:disable-next-line:no-any
  constructor(
    name: string,
    companyName: string,
    phone: string,
    address: Location
  ) {
    this.name = name;
    this.companyName = companyName;
    this.phone = phone;
    this.location = address;
  }
}
