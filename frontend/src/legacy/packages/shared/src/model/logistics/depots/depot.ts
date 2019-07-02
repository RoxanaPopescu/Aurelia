import { Availability } from "./availability";
import { Location } from "../../general/location";
import { observable } from "mobx";

export class Depot {
  // tslint:disable-next-line:no-any
  constructor(json: any = undefined) {
    if (json) {
      this.id = json.id;
      this.ownerId = json.ownerId;
      this.name = json.name;
      this.slotInterval = json.slotInterval;
      this.availabilities = json.availabilities.map(
        availability => new Availability(availability)
      );
      this.location = new Location(json.location);
    } else {
      this.availabilities = [];
    }
  }

  /**
   * The ID of this belongs to.
   */
  @observable public id: string;

  /**
   * The ID of the owner. Should be the higest level fulfiller.
   * Departments should not store depots
   */
  @observable public ownerId: string;

  /**
   * What is the deport called
   */
  @observable public name: string;

  /**
   * The time for each driver
   */
  @observable public slotInterval?: number;

  /**
   * The time for each driver
   */
  @observable public location?: Location;

  /**
   * When is the different ports available
   */
  @observable public availabilities: Availability[];
}
