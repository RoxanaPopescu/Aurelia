import { Position } from "../../general/position";
import { Duration, DateTime } from "luxon";
import { Address } from "../../general/address";
import { DateTimeRange } from "../../general/dateTimeRange";

export class Stop {
  public status:
    | "NotVisited"
    | "Arrived"
    | "NobodyAtLocation"
    | "Completed"
    | "Cancelled"
    | "Deleted";
  public address: Address;
  public position: Position;
  public loadingTime: Duration;
  public delayed: boolean;
  public arrivalTime: DateTime;
  public arrivalTimeFrame: DateTimeRange;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.status = json.status;
    this.address = new Address(json.location.address);
    this.position = new Position(json.location.position);
    this.loadingTime = Duration.fromMillis(json.loadingTime);
    this.delayed = json.isDelayed;
    this.arrivalTime = DateTime.fromISO(json.arrivalTime);
    this.arrivalTimeFrame = new DateTimeRange(json.arrivalTimeFrame, {
      setZone: true
    });
  }
}
