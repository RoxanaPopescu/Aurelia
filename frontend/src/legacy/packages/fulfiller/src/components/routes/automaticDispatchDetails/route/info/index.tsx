import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../../store";
import { RouteBase } from "app/model/route";

interface Props {
  store: RoutePlanningStore;
  route: RouteBase;
  index: number;
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
            <a href={`/routes/details/${this.props.route.slug}`} target="_blank">
              {this.props.index + 1}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
