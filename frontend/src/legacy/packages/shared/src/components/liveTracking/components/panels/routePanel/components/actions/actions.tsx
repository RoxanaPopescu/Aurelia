import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Session } from "shared/src/model/session";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { Icon } from "shared/src/webKit";
import "./actions.scss";
import { Profile } from "shared/src/model/profile";
import { Route, RouteStop } from "app/model/route";

export interface ActionsProps {
  route?: Route;
  onBackClick: () => void;
  onSplitRouteClick: () => void;
  onDriversClick: () => void;
  onRouteDetailsClick: () => void;
}

@observer
export class Actions extends React.Component<ActionsProps> {
  private isFulfiller = Session.outfit instanceof Fulfiller;

  public renderSplitRoute(): JSX.Element | undefined {
    if (!Profile.claims.has("edit-routes") || !this.isFulfiller) {
      return undefined;
    }

    if (
      this.props.route == null ||
      this.props.route.driver == null ||
      ["completed", "cancelled"].includes(this.props.route.status.slug)
    ) {
      return undefined;
    }

    const selectedStops = this.props.route.stops.filter(
      s => (s as RouteStop).selected
    );
    const canSplitRoute = selectedStops.length > 1;

    return (
      <a
        className={!canSplitRoute ? "visually-disabled" : ""}
        onClick={() => canSplitRoute && this.props.onSplitRouteClick()}
        title={Localization.sharedValue(
          "LiveTracking_Actions_SplitRoute_Tooltip"
        )}
      >
        {Localization.sharedValue("LiveTracking_Actions_SplitRoute")}
      </a>
    );
  }

  public render() {
    // tslint:disable-next-line:no-any

    return (
      <div className="c-liveTracking-routePanel-actions">
        <a onClick={() => this.props.onBackClick()}>
          <Icon name="arrowLeft" />
          {Localization.sharedValue("LiveTracking_Actions_BackToRoutes")}
        </a>

        <div className="c-liveTracking-routePanel-actions-group">
          {this.renderSplitRoute()}
          {Profile.claims.has("edit-routes") &&
            this.isFulfiller && (
              <a
                onClick={() => this.props.onDriversClick()}
              >
                {Localization.sharedValue("LiveTracking_Actions_Drivers")}
              </a>
            )}

          <a onClick={() => this.props.onRouteDetailsClick()}>
            {Localization.sharedValue("LiveTracking_Actions_RouteDetails")}
          </a>
        </div>
      </div>
    );
  }
}
