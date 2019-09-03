import React from "react";
import "./styles.scss";
import ItemComponent from "./item";
import { SpecialCondition } from "shared/src/model/logistics/routePlanning/settings";
import { RoutePlanningSettingsStore } from "../../../store";
import { observer } from "mobx-react";
import { Icon } from "shared/src/webKit";

interface Props {
  index: number;
  condition: SpecialCondition;
  store: RoutePlanningSettingsStore;
}

@observer
export default class ListElementComponent extends React.Component<Props> {
  render() {
    let eyeClassNames = "c-routePlanSettings-listElement-Eye";
    if (this.props.store.isConditionHidden(this.props.condition)) {
      eyeClassNames += " notActive";
    }

    return (
      <div
        onMouseOver={() =>
          (this.props.store.highlightedCondition = this.props.condition)
        }
        onMouseOut={() => (this.props.store.highlightedCondition = undefined)}
        className="c-routePlanSettings-listElement-Container"
      >
        <div className="c-routePlanSettings-listElement-Number">
          <div className="font-larger">{this.props.index + 1}</div>
        </div>
        <div
          className={eyeClassNames}
          onClick={() => {
            this.props.store.hideOrShowCondition(this.props.condition);
          }}
        >
          <img src={require("shared/src/assets/interaction/eye.svg")} />
        </div>
        <ItemComponent title="DAGE" content={this.props.condition.dateTitle} />
        <ItemComponent
          title="BEGRÆNSNING"
          content={this.props.condition.limitationTitle}
        />
        <div className="c-autoDispatch-rule-actions">
          <Icon className="c-rpc-icon" name="edit" onClick={() => {
            this.props.store.editingSpecialCondition = this.props.condition;
          }}/>
          <Icon className="c-rpc-icon" name="delete" onClick={() => {
            if (window.confirm("Sikker på du vil fjerne dette areal?")) {
              this.props.store.removeCondition(this.props.condition);
            }
          }}/>
        </div>
      </div>
    );
  }
}
