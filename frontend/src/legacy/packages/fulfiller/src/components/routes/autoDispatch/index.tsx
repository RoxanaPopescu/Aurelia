import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import Localization from "shared/src/localization";
import {
  Button,
  ButtonType,
  ErrorInline,
  LoadingOverlay
} from "shared/src/webKit";
import { Dialog } from "shared/src/components/dialog/dialog";
import { WorldMap } from "shared/src/components/worldMap";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { RouteDispatchService } from "shared/src/components/routes/details/routeDispatchService";
import {
  AutoDispatchService,
  AutoDispatchRule
} from "./services/autoDispatchService";
import { RuleComponent } from "./components/rule/rule";
import { RuleLayerComponent } from "./components/ruleLayer/ruleLayer";
import { EditRuleLayerComponent } from "./components/editRuleLayer/editRuleLayer";
import { EditRuleForm } from "./components/editRuleForm/editRuleForm";
import "./index.scss";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";
import { ButtonSize } from "../../../../../shared/src/webKit/button/index";
import { Log } from "shared/infrastructure";
import { Profile } from "shared/src/model/profile";

@observer
export default class AutoDispatchComponent extends React.Component {
  // tslint:disable-next-line:no-any
  public constructor(props: any) {
    super(props);

    document.title = Localization.operationsValue("Routes_AutoDispatch_Title");

    this.loadFulfillers();
    this.loadRules();
  }

  private readonly routeDispatchService = new RouteDispatchService();

  private readonly autoDispatchService = new AutoDispatchService();

  private fulfillers: Fulfiller[];

  @observable
  private openRule: AutoDispatchRule | undefined;

  @observable
  private validateOpenRule = false;

  @observable
  private selectedRule: AutoDispatchRule | undefined;

  @observable
  private error: Error;

  @observable saving = false;

  public render() {
    if (this.error) {
      return <ErrorInline description={this.error.message} />;
    }

    if (this.autoDispatchService.rules == null) {
      return <LoadingOverlay />;
    }

    return (
      <>
        <PageHeaderComponent
          path={[
            { title: "Ruter" },
            { title: Localization.operationsValue("Routes_AutoDispatch_Title") }
          ]}
        />

        <div className="c-autoDispatch">
          <PageContentComponent>
            <div className="c-autoDispatch-rules">
              {this.autoDispatchService.rules.map(r => (
                <RuleComponent
                  key={r.id}
                  rule={r}
                  service={this.autoDispatchService}
                  selected={r === this.selectedRule}
                  onClick={() => this.onRuleClick(r)}
                  onEdit={() => this.onRuleEditClick(r)}
                  onDelete={() => this.onRuleDeleteClick(r)}
                />
              ))}

              {Profile.claims.has("edit-routes") &&
              <div className="c-autoDispatch-actions">
                <Button
                  type={ButtonType.Action}
                  onClick={() => (this.openRule = new AutoDispatchRule())}
                >
                  {Localization.operationsValue("Routes_AutoDispatch_AddRule")}
                </Button>
              </div>}
            </div>

            <div className="c-autoDispatch-map">
              <WorldMap
                options={{
                  scrollwheel: true
                }}
              >
                {this.autoDispatchService.rules.map(r => (
                  <RuleLayerComponent
                    key={r.id}
                    rule={r}
                    selected={r === this.selectedRule}
                    onClick={() => (this.selectedRule = r)}
                  />
                ))}

                {this.selectedRule && (
                  <EditRuleLayerComponent
                    rule={this.selectedRule}
                    onSave={() =>
                      this.autoDispatchService.saveRule(this.selectedRule!)
                    }
                  />
                )}
              </WorldMap>
            </div>
          </PageContentComponent>
        </div>

        {this.openRule != null && (
          <Dialog
            className="c-autoDispatch-dialog"
            title={
              this.openRule.id
                ? Localization.operationsValue(
                    "Routes_AutoDispatch_EditRule_EditTitle"
                  )
                : Localization.operationsValue(
                    "Routes_AutoDispatch_EditRule_NewTitle"
                  )
            }
            onClose={() => (this.openRule = undefined)}
          >
            <EditRuleForm
              rule={this.openRule}
              validate={this.validateOpenRule}
              fulfillers={this.fulfillers}
            />

            <div className="c-autoDispatch-actions">
              <Button
                type={ButtonType.Action}
                size={ButtonSize.Medium}
                disabled={!this.openRule.isValid || this.saving}
                onClick={() => this.onSaveOpenRule()}
              >
                {Localization.operationsValue(
                  "Routes_AutoDispatch_EditRule_SaveRule"
                )}
              </Button>
            </div>
          </Dialog>
        )}
      </>
    );
  }

  private onRuleClick(rule: AutoDispatchRule) {
    this.selectedRule = rule;
  }

  private onRuleEditClick(rule: AutoDispatchRule) {
    this.openRule = new AutoDispatchRule(rule);
  }

  private async onRuleDeleteClick(rule: AutoDispatchRule) {
    if (confirm("Are you sure you wish to delete this rule?")) {
      try {
        await this.autoDispatchService.deleteRule(rule);
      } catch (error) {
        Log.error("Could not delete rule", error);
      }
    }
  }

  private async onSaveOpenRule() {
    if (!this.openRule!.isValid) {
      this.validateOpenRule = true;
      return;
    }

    this.saving = true;

    try {
      await this.autoDispatchService.saveRule(this.openRule!);
      this.validateOpenRule = false;
      this.saving = false;
      this.selectedRule = this.openRule;
      this.openRule = undefined;
    } catch (error) {
      this.saving = false;
      Log.error("Could not save rule", error);
    }
  }

  private async loadFulfillers(): Promise<void> {
    try {
      this.fulfillers = await this.routeDispatchService.getFulfillers();
    } catch (error) {
      this.error = error;
    }
  }

  private async loadRules(): Promise<void> {
    try {
      await this.autoDispatchService.loadRules();
    } catch (error) {
      this.error = error;
    }
  }
}
