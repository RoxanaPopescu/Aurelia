import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Icon } from "shared/src/webKit";
import "./actions.scss";

export interface ActionsProps {
  enableAssign: boolean;
  enablePush: boolean;
  showPush: boolean;
  onPushClick: () => void;
  onAssignClick: () => void;
  onBackClick: () => void;
}

@observer
export class Actions extends React.Component<ActionsProps> {

  public render() {
    return (
      <div className="c-liveTracking-pushDriversPanel-actions">

        <a onClick={() => this.props.onBackClick()}>
          <Icon name="arrowLeft"/>
          {Localization.sharedValue("LiveTracking_Actions_BackToRoute")}
        </a>

        {this.props.showPush &&
          <a
          className={!this.props.enablePush ? "disabled" : ""}
          onClick={() => this.props.onPushClick()}
        >
          {Localization.sharedValue("LiveTracking_Actions_SendPushDrivers")}
        </a>
        }

        <a
          className={!this.props.enableAssign ? "disabled" : ""}
          onClick={() => this.props.onAssignClick()}
        >
          {Localization.sharedValue("LiveTracking_Actions_AssignToDriver")}
        </a>

      </div>
    );
  }
}
