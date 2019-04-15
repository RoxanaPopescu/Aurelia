import { Parameters } from "shared/src/model/logistics/routePlanning/settings";
import { observable } from "mobx";

export class RouteSimulationStart {

  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.name = data.name;
    this.routePlanId = data.routePlanId;
    this.parameters = new Parameters(data.parameters);
  }

  @observable
  public name: string;

  public routePlanId: string;
  
  public parameters: Parameters;
}