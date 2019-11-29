import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Session } from "shared/src/model/session";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { Route } from "shared/src/model/logistics/routes/tracking";
import { Icon } from "shared/src/webKit";
import "./actions.scss";
import { RouteStop } from "shared/src/model/logistics/routes";
import { Profile } from "shared/src/model/profile";

export interface ActionsProps {
  route: Route;
  onBackClick: () => void;
  onSplitRouteClick: () => void;
  onRouteDetailsClick: () => void;
}

@observer
export class Actions extends React.Component<ActionsProps> {
  private isFulfiller = Session.outfit instanceof Fulfiller;

  public render() {
    // tslint:disable-next-line:no-any

    const selectedStops = this.props.route.stops.filter(
      s => (s as RouteStop).selected
    );

    const canSplitRoute = selectedStops.length > 1;

    return (
      <div className="c-liveTracking-routePanel-actions">
        <a onClick={() => this.props.onBackClick()}>
          <Icon name="arrowLeft" />
          {Localization.sharedValue("LiveTracking_Actions_BackToRoutes")}
        </a>

        <div className="c-liveTracking-routePanel-actions-group">
          {Profile.claims.has("edit-route") &&
            this.isFulfiller &&
            this.props.route.status.slug !== "completed" &&
            this.props.route.status.slug !== "cancelled" && (
              <a
                className={!canSplitRoute ? "visually-disabled" : ""}
                onClick={() => canSplitRoute && this.props.onSplitRouteClick()}
                title={Localization.sharedValue(
                  "LiveTracking_Actions_SplitRoute_Tooltip"
                )}
              >
                {Localization.sharedValue("LiveTracking_Actions_SplitRoute")}
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
