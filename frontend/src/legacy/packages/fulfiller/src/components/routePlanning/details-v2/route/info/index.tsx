import React from "react";
import "./styles.scss";
import { RoutePlanRoute } from "shared/src/model/logistics/routePlanning";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../../store";
import { Container } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";

interface Props {
  store: RoutePlanningStore;
  route: RoutePlanRoute;
}

@observer
export default class RoutePlanningRouteInfoComponent extends React.Component<
  Props
> {
  render() {
    const historyHelper = Container.instance.get(HistoryHelper);
    return (
      <div
        className="c-routePlanning-routes-routeInfo"
        onClick={() => this.props.store.focusRoute(this.props.route)}
      >
        <div className="c-routePlanning-routes-route-infoContent">
          <div className="c-routePlanning-routes-route-id">
            {this.props.route.slug
            ? <a href={historyHelper.getRouteUrl(`/routes/details/${this.props.route.slug}`)}>{this.props.route.slug}</a>
            : "--"}
          </div>
        </div>
      </div>
    );
  }
}
