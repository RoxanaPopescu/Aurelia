import { Journey } from "./";
import { Dimensions } from "app/model/shared";

export class Collo {
  public id: string;
  public barcode: string;
  public weight?: number;
  public dimensions?: Dimensions;
  public journey?: Journey;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.id = json.internalId;
    this.barcode = json.barcode;
    this.weight = json.weight;
    if (json.dimensions) {
      this.dimensions = new Dimensions(json.dimensions);
    }
    if (json.journey) {
      this.journey = new Journey(json.journey);
    }
  }
}
