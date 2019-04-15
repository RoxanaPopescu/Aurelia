import { observable, action } from "mobx";
import Localization from "shared/src/localization";
import Base from "shared/src/services/base";
import { RoutePlanSetting } from "shared/src/model/logistics/routePlanning/settings";

export class RoutePlanSettingListStore {
  @observable
  loading: boolean = true;
  @observable
  error?: string;
  @observable
  settings: RoutePlanSetting[] = [];
  headers = [
    {
      text: "Navn",
      key: "8"
    },
    {
      text: "Specielle regler",
      key: "4"
    }
  ];

  @action
  async fetch() {
    this.loading = true;
    this.error = undefined;

    let response = await fetch(
      Base.url("RoutePlanning/settings/List"),
      Base.defaultConfig({})
    );

    if (response.ok) {
      let responseJson = await response.json();
      this.settings = responseJson.map(
        setting => new RoutePlanSetting(setting)
      );
    } else {
      this.error = Localization.sharedValue("Error_General");
    }

    this.loading = false;
  }
}
