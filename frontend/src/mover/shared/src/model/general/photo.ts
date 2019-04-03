import { DateTime } from "luxon";
import { Position } from "./position";

/**
 * Represents a photo provided as evidence that a task was completed.
 */
export class Photo {

  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.date = DateTime.fromISO(data.date, { setZone: true });
    this.imageUrl = data.imageUrl;
  }

  /**
   * The date and time at which the photo was captured.
   */
  public date: DateTime;

  /**
   * The URL for the photo.
   */
  public imageUrl: string;

  /**
   * The position at which the photo was captured.
   */
  public position: Position;
}