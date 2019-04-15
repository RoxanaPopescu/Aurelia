import { Journey } from "./";
export class Collo {
  public id: string;
  public barcode: string;
  public journey?: Journey;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.id = json.internalId;
    this.barcode = json.barcode;
    if (json.journey) {
      this.journey = new Journey(json.journey);
    }
  }
}
