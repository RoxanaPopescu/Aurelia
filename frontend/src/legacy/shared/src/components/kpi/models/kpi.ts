/**
 * Represents a single KPI.
 */
export class Kpi {
  // tslint:disable-next-line:no-any
  public constructor(headline: string, value: any) {
    this.headline = headline;
    this.value = value;
  }

  /**
   * The headline of the KPI
   */
  public readonly headline: string;

  /**
   * The value of the KPI
   */
  // tslint:disable-next-line:no-any
  public readonly value: any;
}
