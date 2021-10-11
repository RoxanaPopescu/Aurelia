import { observable, computed } from "mobx";
import BaseService from "shared/src/services/base";
import { Position } from "shared/src/model/general/position";

export class AutoDispatchRulePolygon {
  // tslint:disable-next-line:no-any
  public constructor(data?: any) {
    // This test should be `data instanceof google.maps.Polygon`, but that would
    // introduce a race condition, and fail if Google Maps is not yet loaded.
    if (data.getPath instanceof Function) {
      this.positions = data.getPath().getArray().map(x => new Position({ latitude: x.lat(), longitude: x.lng() }));
      this.positions[this.positions.length] = this.positions[0];
    } else if (data != null) {
      this.positions = data.positions.map(p => new Position(p));
    }
  }

  @observable
  public positions: Position[];
}

export class AutoDispatchRuleConditions {

  // tslint:disable-next-line:no-any
  public constructor(data?: any) {
    if (data != null) {
      if (data.polygons != null) {
        this.polygons = data.polygons.map(p => new AutoDispatchRulePolygon(p));
      }
    }
  }

  @observable
  public polygons: AutoDispatchRulePolygon[] | undefined;
}

export class AutoDispatchRule {

  // tslint:disable-next-line:no-any
  public constructor(data?: any) {
    if (data != null) {
      this.id = data.id;
      this.label = data.label;
      this.outfitId = data.outfitId;
      this.priority = data.priority;
      this.fulfillerId = data.fulfillerId;
      this.conditions = new AutoDispatchRuleConditions(data.conditions);
      if (data.routeTagsAllRequired) {
        this.routeTagsAllRequired = data.routeTagsAllRequired;
      }
      if (data.routeTagsOneRequired) {
        this.routeTagsOneRequired = data.routeTagsOneRequired;
      }
    } else {
      this.conditions = new AutoDispatchRuleConditions();
    }
  }

  public readonly id: string;

  @observable
  public label: string;

  @observable
  public outfitId: string;

  @observable
  public priority = 0;

  @observable
  public fulfillerId: string;

  @observable
  public routeTagsAllRequired: string[] = [];

  @observable
  public routeTagsOneRequired: string[] = [];

  @observable
  public conditions: AutoDispatchRuleConditions;

  @computed
  public get isValid(): boolean {
    return !!this.label && this.priority >= 0 && !!this.fulfillerId && !!this.conditions;
  }
}

export class AutoDispatchService {

  @observable
  private _busy: boolean = false;

  @observable
  private _rules: AutoDispatchRule[];

  @computed
  public get busy(): boolean {
    return this._busy;
  }

  @computed
  public get rules(): ReadonlyArray<AutoDispatchRule> {
    return this._rules;
  }

  public async saveRule(rule: AutoDispatchRule): Promise<void> {
    this._busy = true;

    const response = await fetch(
      BaseService.url("dispatch/route/automatic-contractor/save"),
      BaseService.defaultConfig(rule)
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not save rule.");
    }

    const data = await response.json();

    const ruleIndex = this._rules.findIndex(r => r.id === rule.id);

    if (ruleIndex > -1) {
      this._rules[ruleIndex] = new AutoDispatchRule(data);
    } else {
      this._rules.push(new AutoDispatchRule(data));
    }

    this._busy = false;
  }

  public async deleteRule(rule: AutoDispatchRule): Promise<void> {
    this._busy = true;

    const response = await fetch(
      BaseService.url("dispatch/route/automatic-contractor/delete"),
      BaseService.defaultConfig({ ruleId: rule.id })
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not remove rule.");
    }

    this._rules.splice(this._rules.indexOf(rule), 1);

    this._busy = false;
  }

  public async loadRules(): Promise<void> {
    this._busy = true;

    // FIXME: agreements

    const response = await fetch(
      BaseService.url("dispatch/route/automatic-contractor"),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      this._busy = false;
      throw new Error("Could not get rules.");
    }

    const data = await response.json();

    this._rules = data.map(v => new AutoDispatchRule(v));

    this._busy = false;
  }
}
