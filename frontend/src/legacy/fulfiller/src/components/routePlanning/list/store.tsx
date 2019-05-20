import { observable, action } from "mobx";
import { ListRoutePlan } from "shared/src/model/logistics/routePlanning";
import Localization from "shared/src/localization";
import Base from "shared/src/services/base";

export class RoutePlanListStore {
  @observable
  loading: boolean = true;
  @observable
  error?: string;
  @observable
  plans: ListRoutePlan[] = [];
  headers = [
    {
      content: Localization.sharedValue("Timeframe"),
      key: "8"
    },
    {
      content: Localization.sharedValue("Header_Created"),
      key: "4"
    },
    {
      content: Localization.sharedValue("Header_LastUpdated"),
      key: "5"
    },
    {
      content: Localization.sharedValue("Header_Routes"),
      key: "6"
    },
    {
      content: Localization.sharedValue("Header_UnscheduledTasks"),
      key: "7"
    },
    {
      content: Localization.sharedValue("Header_Status"),
      key: "9"
    }
  ];

  @action
  async fetch() {
    this.loading = true;
    this.error = undefined;

    let response = await fetch(
      Base.url("RoutePlanning/List"),
      Base.defaultConfig({
        statuses: []
      })
    );

    if (response.ok) {
      let responseJson = await response.json();
      this.plans = responseJson.results.map(plan => new ListRoutePlan(plan));
    } else {
      this.error = Localization.sharedValue("Error_General");
    }

    this.loading = false;
  }
}
