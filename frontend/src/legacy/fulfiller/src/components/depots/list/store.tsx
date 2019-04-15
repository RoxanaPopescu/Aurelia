import { observable, action } from "mobx";
import Localization from "shared/src/localization";
import Base from "shared/src/services/base";
import { Depot } from "shared/src/model/logistics/depots/depot";

export class DepotsListStore {
  @observable
  loading: boolean = true;
  @observable
  error?: string;
  @observable
  depots: Depot[] = [];
  headers = [
    {
      text: "Navn",
      key: ""
    },
    {
      text: "Adresse",
      key: ""
    }
  ];

  @action
  async fetch() {
    this.loading = true;
    this.error = undefined;

    let response = await fetch(
      Base.url("Depots/List"),
      Base.defaultConfig({
        statuses: []
      })
    );

    if (response.ok) {
      let responseJson = await response.json();
      this.depots = responseJson.map(depot => new Depot(depot));
    } else {
      this.error = Localization.sharedValue("Error_General");
    }

    this.loading = false;
  }
}
