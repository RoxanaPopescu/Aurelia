import { observable, action } from "mobx";
import { Depot, Availability } from "shared/src/model/logistics/depots";
import Base from "shared/src/services/base";
import Localization from "shared/src/localization";

export class DepotStore {
  @observable
  activeGate?: Availability;

  @observable
  loading: boolean = true;
  @observable
  saving: boolean = false;
  @observable
  error?: string;

  @observable
  depot: Depot;

  @action
  async fetch(id: string) {
    this.loading = true;
    this.error = undefined;

    let response = await fetch(
      Base.url(`distribution-centers/${id}`),
      Base.defaultConfig(undefined)
    );

    if (response.ok) {
      let responseJson = await response.json();
      let depot = new Depot(responseJson);
      this.depot = depot;
    } else {
      this.error = Localization.sharedValue("Error_General");
    }

    this.loading = false;
  }

  @action
  async updateDepot() {
    // If no ports we require them to be created
    if (this.depot.availabilities.length <= 0) {
      this.activeGate = new Availability();
      return;
    }

    this.saving = true;
    this.error = undefined;

    if (this.depot.id) {
      let response = await fetch(
        Base.url("Depots/Update"),
        Base.defaultConfig(this.depot)
      );

      if (!response.ok) {
        this.error = Localization.sharedValue("Error_General");
      }
    } else {
      let response = await fetch(
        Base.url("Depots/Create"),
        Base.defaultConfig(this.depot)
      );

      if (response.ok) {
        let responseJson = await response.json();
        let depot = new Depot(responseJson);
        this.depot = depot;
      } else {
        this.error = Localization.sharedValue("Error_General");
      }
    }

    this.activeGate = undefined;
    this.saving = false;
  }
}
