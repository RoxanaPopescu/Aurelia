import { Parameters } from ".";
import { observable } from "mobx";

/**
 * Represents the settings to use when planning routes.
 */
export class RoutePlanSetting {
  // tslint:disable-next-line:no-any
  constructor(data: any = undefined) {
    if (data) {
      this.id = data.id;
      this.fulfillerId = data.fulfillerId;
      this.name = data.name;
      this.orderGroupIds = data.orderGroupIds;
      this.consignorIds = data.consignorIds;
      this.parameters = new Parameters(data.parameters);
    } else {
      this.orderGroupIds = [];
      this.consignorIds = [];
      this.parameters = new Parameters();
    }
  }

  /**
   * The id of the setting.
   */
  @observable
  public id: string;

  /**
   * The id of fulfiller.
   */
  @observable
  public fulfillerId: string;

  /**
   * The name of the setting.
   */
  @observable
  public name: string;

  /**
   * The name of the setting.
   */
  @observable
  public orderGroupIds: string[];

  /**
   * The name of the setting.
   */
  @observable
  public consignorIds: string[];

  /**
   * The name of the setting.
   */
  @observable
  public parameters: Parameters;
}
