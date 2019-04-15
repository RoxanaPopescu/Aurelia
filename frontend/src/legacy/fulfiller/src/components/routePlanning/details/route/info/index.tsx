import React from "react";
import "./styles.scss";
import { RoutePlanRoute } from "shared/src/model/logistics/routePlanning";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../../store";

interface Props {
  store: RoutePlanningStore;
  route: RoutePlanRoute;
}

@observer
export default class RoutePlanningRouteInfoComponent extends React.Component<
  Props
> {
  render() {
    return (
      <div
        className="c-routePlanning-routes-routeInfo"
        onClick={() => this.props.store.focusRoute(this.props.route)}
      >
        <div className="c-routePlanning-routes-route-infoContent">
          <div className="c-routePlanning-routes-route-id">
            {this.props.route.slug ? this.props.route.slug : "--"}
          </div>
        </div>
      </div>
    );
  }
}
