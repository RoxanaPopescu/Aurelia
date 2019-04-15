import { observable } from "mobx";
import { DateTime, Duration } from "luxon";
import Localization from "shared/src/localization";
import { Position } from "../../../general/position";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";

/**
 * Represents a special condition to be taken into account when planning a route.
 */
export class SpecialCondition {
  // tslint:disable-next-line:no-any
  constructor(data: any = undefined) {
    if (data) {
      this.days = data.days;
      this.id = data.id;
      if (data.startDate != null) {
        this.startDate = DateTime.fromISO(data.startDate, { setZone: true });
      }
      if (data.endDate != null) {
        this.endDate = DateTime.fromISO(data.endDate, { setZone: true });
      }
      this.endDate = data.endDate;
      this.isBlocked = data.isBlocked;
      if (data.additionalLoadingTime) {
        this.additionalLoadingTime = data.additionalLoadingTime;
      }
      this.additionalTrafficPercentage = data.additionalTrafficPercentage;
      this.area = data.area.map(position => new Position(position));
    } else {
      this.isBlocked = false;
    }
  }

  /*
   * The ID of the special condition.
   */
  @observable
  public id?: string;

  /**
   * The start date from where this is active
   */
  @observable
  public startDate?: DateTime;

  /**
   * The start date from where this is active
   */
  @observable
  public endDate?: DateTime;

  /**
   * The weekdays this is active. Either this or date is required
   */
  @observable public days: number[];

  /**
   * The area can be blocked, route planning will not use this area
   */
  @observable public isBlocked: boolean;

  /**
   * The area can have additional loading time in seconds
   */
  @observable public additionalLoadingTime?: number;

  /**
   * The area can have additional driving time in procent
   */
  @observable public additionalTrafficPercentage?: number;

  /**
   * The positions of the area as a polygon
   */
  @observable public area: Position[];

  /**
   * The map path of the positions
   */
  public get mapPath(): google.maps.LatLng[] {
    return this.area.map(position => position.toGoogleLatLng());
  }

  /**
   * The google maps polygon of the positions
   */
  public get mapPolygon(): google.maps.Polygon {
    let polygon = new google.maps.Polygon();
    polygon.setPath(this.mapPath);
    return polygon;
  }

  public get dateTitle(): string {
    let title = Localization.formatWeekdays(this.days);

    if (this.startDate || this.endDate) {
      title +=
        " " +
        Localization.formatDateRange(
          new DateTimeRange({ from: this.startDate, to: this.endDate })
        );
    }

    return title;
  }

  public get limitationTitle(): string {
    if (this.isBlocked) {
      return "Blokeret område";
    }

    let info: string[] = [];

    if (this.additionalLoadingTime) {
      info.push(
        "+ " +
          Localization.formatDuration(
            Duration.fromObject({ seconds: this.additionalLoadingTime })
          ) +
          " læssetid"
      );
    }

    if (this.additionalTrafficPercentage) {
      info.push(
        "+ " + Math.round(this.additionalTrafficPercentage * 100) + "% køretid"
      );
    }

    return info.join(", ");
  }

  public validate(): boolean {
    if (
      (this.startDate || this.endDate) &&
      (!this.startDate || !this.endDate)
    ) {
      return false;
    }

    if (
      this.isBlocked === false &&
      !this.additionalLoadingTime &&
      !this.additionalTrafficPercentage
    ) {
      return false;
    }

    return true;
  }
}
