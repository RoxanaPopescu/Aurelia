import { observable } from "mobx";

/**
 * Represents flow parameters for a single route plan
 */
export class FlowParameters {
  // tslint:disable-next-line:no-any
  constructor(data: any = undefined) {
    if (data) {
      this.manuallyApproveRoutes = data.manuallyApproveRoutes;
    } else {
      this.manuallyApproveRoutes = false;
    }
  }

  /*
   * Should route plans be manually approved.
   */
  @observable
  public manuallyApproveRoutes: boolean;
}
