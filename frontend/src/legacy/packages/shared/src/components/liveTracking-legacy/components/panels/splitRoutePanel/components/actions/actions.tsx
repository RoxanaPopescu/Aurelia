import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Icon } from "shared/src/webKit";
import "./actions.scss";

export interface ActionsProps {
  enableConfirmSplit: boolean;
  onConfirmSplitClick: () => void;
  onBackClick: () => void;
}

@observer
export class Actions extends React.Component<ActionsProps> {

  public render() {
    return (
      <div className="c-liveTracking-splitRoutePanel-actions">

        <a onClick={() => this.props.onBackClick()}>
          <Icon name="arrowLeft"/>
          {Localization.sharedValue("LiveTracking_Actions_BackToRoute")}
        </a>

        <a
          className={!this.props.enableConfirmSplit ? "disabled" : ""}
          onClick={() => this.props.onConfirmSplitClick()}
        >
          {Localization.sharedValue("LiveTracking_Actions_ConfirmSplit")}
        </a>

      </div>
    );
  }
}
