import { DateTime } from "luxon";
import BaseService from "shared/src/services/base";
import { observable } from "mobx";
import { ScannedColliOverview } from "./model/overview";
import { MissingColli } from "./model/missingColli";

export class DepotColliService {
  @observable
  overview?: ScannedColliOverview;

  @observable
  missingColli: MissingColli[] = [];

  @observable
  selectedConsignor?: string;

  @observable
  loadingColli = true;

  public reset() {
    this.overview = undefined;
  }

  public async fetchOverview(
    depotId: string,
    fromDate: DateTime,
    toDate: DateTime
  ): Promise<void> {
    const response = await fetch(
      BaseService.url("depots/colli/overview"),
      BaseService.defaultConfig({
        depotId: depotId,
        fromDate: fromDate,
        toDate: toDate
      })
    );

    if (!response.ok) {
      throw new Error("Could not get depot colli overview.");
    }

    let responseJson = await response.json();
    this.overview = new ScannedColliOverview(responseJson);
  }

  public async fetchMissing(
    depotId: string,
    fromDate: DateTime,
    toDate: DateTime,
    consignorId?: string
  ): Promise<void> {
    this.loadingColli = true;

    const response = await fetch(
      BaseService.url("depots/colli/missing"),
      BaseService.defaultConfig({
        depotId: depotId,
        fromDate: fromDate,
        toDate: toDate,
        consignorIds: consignorId ? [consignorId] : undefined
      })
    );

    if (!response.ok) {
      this.loadingColli = false;
      throw new Error("Could not get depot missing colli.");
    }

    let responseJson = await response.json();
    this.missingColli = responseJson.map(missing => new MissingColli(missing));
    this.loadingColli = false;
  }
}
