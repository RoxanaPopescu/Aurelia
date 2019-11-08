import { GoogleMap } from "react-google-maps";
import { observable, action } from "mobx";
import {
  RoutePlanSetting,
  SpecialCondition
} from "shared/src/model/logistics/routePlanning/settings";
import { Position } from "shared/src/model/general/position";
import Base from "shared/src/services/base";
import Localization from "shared/src/localization";
import { RoutePlanStrategy } from "shared/src/model/logistics/routePlanning/settings/strategy";

export class RoutePlanningSettingsStore {
  @observable
  loading: boolean = true;
  @observable
  saving: boolean = false;
  @observable
  error?: string;

  @observable
  toastMessage?: string;

  @observable
  map?: GoogleMap;

  @observable
  currentDrawing?: google.maps.Polygon;

  @observable
  editingSpecialCondition?: SpecialCondition;

  @observable
  hiddenConditions: SpecialCondition[] = [];

  @observable
  highlightedCondition?: SpecialCondition;

  @observable
  setting: RoutePlanSetting = new RoutePlanSetting();

  @observable
  availableStrategies: RoutePlanStrategy[] = [];

  @observable
  mode: "idle" | "drawing" | "drawingComplete" | "assigningSettings" = "idle";

  mapLoaded(ref: GoogleMap) {
    if (!ref || this.map) {
      return;
    }

    this.map = ref;
    this.zoom();
  }

  isConditionHidden(conditions: SpecialCondition) {
    return this.hiddenConditions.indexOf(conditions, 0) > -1;
  }

  @action
  hideOrShowCondition(conditions: SpecialCondition) {
    const index = this.hiddenConditions.indexOf(conditions, 0);
    if (index > -1) {
      this.hiddenConditions.splice(index, 1);
    } else {
      this.hiddenConditions.push(conditions);
    }
  }

  @action
  hideOrShowAllCondition() {
    if (this.hiddenConditions.length > 0) {
      this.hiddenConditions = [];
    } else {
      this.hiddenConditions = this.setting.parameters.specialConditions.slice();
    }
  }

  @action
  addCondition(condition: SpecialCondition) {
    let positions = this.currentDrawing!.getPath()
      .getArray()
      .map(
        position =>
          new Position({
            latitude: position.lat(),
            longitude: position.lng()
          })
      );

    positions.push(positions[0]);
    condition.area = positions;
    this.setting.parameters.specialConditions.push(condition);
    this.updateSetting();
  }

  @action
  updateCondition(condition: SpecialCondition) {
    for (let specialCondition of this.setting.parameters.specialConditions) {
      if (specialCondition.id === condition.id) {
        Object.assign(specialCondition, condition);
        this.updateSetting();
        break;
      }
    }
  }

  @action
  clearDrawing() {
    this.mode = "idle";

    if (this.currentDrawing) {
      this.currentDrawing.setMap(null);
    }

    this.currentDrawing = undefined;
  }

  @action
  completedDrawing(polygon: google.maps.Polygon) {
    this.clearDrawing();
    this.currentDrawing = polygon;
    this.mode = "drawingComplete";
  }

  @action
  removeCondition(condition: SpecialCondition) {
    const index = this.setting.parameters.specialConditions.indexOf(
      condition,
      0
    );
    if (index > -1) {
      this.setting.parameters.specialConditions.splice(index, 1);
    }

    this.updateSetting();
  }

  @action
  async fetch(id: string) {
    this.loading = true;
    this.error = undefined;

    let response = await fetch(
      Base.url("RoutePlanning/settings/Details"),
      Base.defaultConfig({
        id: id
      })
    );

    if (response.ok) {
      let responseJson = await response.json();
      this.setting = new RoutePlanSetting(responseJson);
    } else {
      this.error = Localization.sharedValue("Error_General");
    }

    this.loading = false;
    this.zoom();
  }

  @action
  async fetchStrategies() {
    this.loading = true;
    this.error = undefined;

    let response = await fetch(
      Base.url("RoutePlanning/settings/strategies/list"),
      Base.defaultConfig()
    );

    if (response.ok) {
      let responseJson = await response.json();
      this.availableStrategies = responseJson.map(s => new RoutePlanStrategy(s.name));
    } else {
      this.error = Localization.sharedValue("Error_General");
    }

    this.loading = false;
    this.zoom();
  }

  @action
  zoom() {
    // tslint:disable-next-line:no-any
    let map: any = this.map;
    if (!this.map) {
      return;
    }

    if (this.setting.parameters.specialConditions.length > 0) {
      let bounds = new google.maps.LatLngBounds();

      for (let condition of this.setting.parameters.specialConditions) {
        for (let position of condition.area) {
          bounds.extend(position.toGoogleLatLng());
        }
      }

      map.fitBounds(bounds, 50);
    }
  }

  @action
  async updateSetting() {
    this.saving = true;
    this.error = undefined;

    if (this.setting.id) {
      let response = await fetch(
        Base.url("RoutePlanning/settings/Update"),
        Base.defaultConfig({ ...this.setting, parameters: { ...this.setting.parameters, strategy: this.setting.parameters.strategy.value } })
      );

      if (!response.ok) {
        this.error = Localization.sharedValue("Error_General");
      } else {
        this.toastMessage = "Opdaterede indstilling: " + this.setting.name;
      }
    } else {
      let response = await fetch(
        Base.url("RoutePlanning/settings/Create"),
        Base.defaultConfig({ ...this.setting, parameters: { ...this.setting.parameters, strategy: this.setting.parameters.strategy.value } })
      );

      if (response.ok) {
        let responseJson = await response.json();
        this.setting = new RoutePlanSetting(responseJson);
        this.toastMessage = "Oprettede indstilling: " + this.setting.name;
      } else {
        this.error = Localization.sharedValue("Error_General");
      }
    }

    this.editingSpecialCondition = undefined;
    this.mode = "idle";
    this.clearDrawing();
    this.saving = false;
  }
}
