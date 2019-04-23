import { DateTime } from "luxon";
import { DepotRouteRemark } from "./depotRouteRemark";
import { remarks } from "./data/depotRouteRemarks";

export class DepotRoute {
  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.id = data.id;
    this.slug = data.slug;
    this.gate = data.gate;
    this.driverId = data.driverId;
    this.fulfillerName = data.fulfillerName;
    this.plannedArrival = DateTime.fromISO(data.plannedArrival, {
      setZone: true
    });
    this.plannedDeparture = DateTime.fromISO(data.plannedDeparture, {
      setZone: true
    });
    this.colliScanned = data.colliScanned;
    this.colliTotal = data.colliTotal;
    this.driverListReady = data.driverListReady;
    this.driverListUrl = data.driverListUrl;

    if (data.remarks != null) {
      this.remarks = data.remarks.remarkCodes.map(
        rc =>
          remarks.find(r => r.code === rc) ||
          new DepotRouteRemark({ code: rc, name: "Unknown" })
      );

      this.note = data.remarks.note;
    } else {
      this.remarks = [];
    }

    if (data.actualArrival != null) {
      this.actualArrival = DateTime.fromISO(data.actualArrival, {
        setZone: true
      });
    }

    if (data.actualDeparture != null) {
      this.actualDeparture = DateTime.fromISO(data.actualDeparture, {
        setZone: true
      });
    }
  }

  public readonly id: string;
  public readonly slug: string;
  public readonly gate: string;
  public readonly driverId: string;
  public readonly fulfillerName: string;
  public readonly plannedArrival: DateTime;
  public readonly plannedDeparture: DateTime;
  public readonly actualArrival: DateTime | undefined;
  public readonly actualDeparture: DateTime | undefined;
  public readonly colliScanned: number;
  public readonly colliTotal: number;
  public readonly driverListReady: boolean;
  public readonly driverListUrl: string;
  public readonly remarks: DepotRouteRemark[];
  public note: string | undefined;

  public hasRemarks(problem: DepotRouteRemark): boolean {
    return this.remarks.some(i => i.code === problem.code);
  }

  public addRemark(problem: DepotRouteRemark): void {
    if (!this.hasRemarks(problem)) {
      this.remarks.push(problem);
    }
  }

  public removeRemark(problem: DepotRouteRemark): void {
    const index = this.remarks.findIndex(i => i.code === problem.code);
    if (index > -1) {
      this.remarks.splice(index, 1);
    }
  }
}
