import { observable } from "mobx";

export class Availability {
  // tslint:disable-next-line:no-any
  constructor(json: any = undefined) {
    if (json) {
      this.openingTime = json.openingTime;
      this.closingTime = json.closingTime;
      this.numberOfGates = json.numberOfGates;
      this.daysOfWeek = json.daysOfWeek;
      this.created = true;
    } else {
      this.created = false;
    }
  }

  /**
   * Time of day in seconds when it's open
   */
  @observable public openingTime?: number;

  /**
   * Time of day in seconds when it's closed
   */
  @observable public closingTime?: number;

  /**
   * How many gates exist
   */
  @observable public numberOfGates?: number;

  /**
   * Day of week (ISO standard)
   */
  @observable public daysOfWeek?: number[];

  /**
   * Has it been created on the server?
   */
  public created: boolean;
}
