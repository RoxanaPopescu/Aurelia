/**
 * Represents a single overview data.
 */
export class OverviewData {
  /* tslint:disable-next-line: no-any */
  public constructor(name: string, value: number | string) {
    this.name = name;
    this.value = value;
  }

  /**
   * The name of the overview data
   */
  public readonly name: string;

  /**
   * The value of the overview data
   */
  public readonly value: number | string;
}
