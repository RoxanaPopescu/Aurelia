import { DateTime } from "luxon";
import { DateTimeRange } from "../../general/dateTimeRange";
import { RoutePlanStatus } from "./routePlan";

export class ListRoutePlan {
  id: string;
  outfitId: string;
  createdBy: string;
  created: DateTime;
  status: RoutePlanStatus;
  lastUpdated: DateTime;
  routeCount: number;
  unscheduledStopsCount: number;
  timeFrame?: DateTimeRange;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.id = json.id;
    this.outfitId = json.outfitId;
    this.createdBy = json.createdBy;
    this.created = DateTime.fromISO(json.created);
    this.status = json.status;
    this.lastUpdated = DateTime.fromISO(json.lastUpdated);
    this.routeCount = json.routeCount;
    this.unscheduledStopsCount = json.unscheduledStopsCount;
    if (json.timeFrame) {
      this.timeFrame = new DateTimeRange(json.timeFrame);
    }
  }
}
