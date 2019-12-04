import React from "react";
import { observer } from "mobx-react";
import { Icon } from "shared/src/webKit";
import { AutoDispatchService, AutoDispatchRule } from "../../services/autoDispatchService";
import "./rule.scss";
import { Profile } from "shared/src/model/profile";

export interface Props {
  service: AutoDispatchService;
  rule: AutoDispatchRule;
  selected?: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

@observer
export class RuleComponent extends React.Component<Props> {

  public render() {

    return (
      <div
        className={`c-autoDispatch-rule ${this.props.selected ? "c-autoDispatch-rule--selected" : ""}`}
        onClick={() => this.props.onClick()}
      >
        {this.props.rule.label}

        <div className="c-autoDispatch-rule-actions">

          {Profile.claims.has("edit-routes") &&
          <>
            <Icon name="edit" onClick={() => this.props.onEdit()}/>

            <Icon name="delete" onClick={() => this.props.onDelete()}/>
          </>}

        </div>

      </div>
    );
  }
}
