import { Driver } from "shared/src/model/logistics/order/driver";
import { Forecast } from "./forecast";

/**
 * Represents a single prebooking.
 */
export class Prebooking {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.id = data.id;
    this.slug = data.slug;
    this.forecast = new Forecast(data.forecast);
    // TODO: REMOVE WHEN DATA IS OK
    if (!data.driver.name) {
      data.driver.name = { first: "--", last: "--" };
      data.driver.phone = { countryPrefix: "", number: "" };
    }
    this.driver = new Driver(data.driver);
  }

  /**
   * The ID of the prebooking
   */
  public readonly id: string;

  /**
   * The slug identifying the prebooking
   */
  public slug: string;

  /**
   * The forecast related to the prebooking
   */
  public forecast: Forecast;

  /**
   * The driver associated to this prebooking
   */
  public readonly driver: Driver;
}
