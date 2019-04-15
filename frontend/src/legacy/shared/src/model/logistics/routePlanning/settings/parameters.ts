import { observable } from "mobx";
import { SpecialCondition, LoadingTimes, Limitations } from ".";

/**
 * Represents the parameters to use when planning a route.
 */
export class Parameters {
  // tslint:disable-next-line:no-any
  constructor(data: any = undefined) {
    if (data) {
      this.loadingTimes = new LoadingTimes(data.loadingTimes);
      this.limitations = new Limitations(data.limitations);
      this.specialConditions = data.specialConditions.map(c => new SpecialCondition(c));
    } else {
      this.specialConditions = [];
      this.loadingTimes = new LoadingTimes();
      this.limitations = new Limitations();
      this.specialConditions = [];
    }
  }

  /**
   * The loadingTimes for this setting.
   */
  @observable
  public loadingTimes: LoadingTimes;

  /**
   * The limitations for this setting.
   */
  @observable
  public limitations: Limitations;

  /**
   * The special conditions for this setting.
   */
  @observable
  public specialConditions: SpecialCondition[];
}
