import { observable } from "mobx";
import { SpecialCondition } from "./specialCondition";
import { LoadingTimes } from "./loadingTimes";
import { Limitations } from "./limitations";
import { FlowParameters } from "./flowParameters";

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
      this.flowParameters = new FlowParameters(data.flowParameters);
    } else {
      this.specialConditions = [];
      this.loadingTimes = new LoadingTimes();
      this.limitations = new Limitations();
      this.specialConditions = [];
      this.flowParameters = new FlowParameters();
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
   * The flow parameters for this setting.
   */
  @observable
  public flowParameters: FlowParameters;

  /**
   * The special conditions for this setting.
   */
  @observable
  public specialConditions: SpecialCondition[];
}
