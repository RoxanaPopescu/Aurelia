import { DateTime } from "luxon";

export class RouteSimulationInfo {

  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.id = data.id;
    this.created = DateTime.fromISO(data.created);
    this.name = data.name;
  }

  public readonly id: string;
  public readonly created: DateTime | undefined;
  public name: string;
}