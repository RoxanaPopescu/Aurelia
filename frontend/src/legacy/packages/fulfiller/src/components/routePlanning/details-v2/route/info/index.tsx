import React from "react";
import "./styles.scss";
import { RoutePlan, RoutePlanRoute } from "shared/src/model/logistics/routePlanning";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../../store";
import { Container } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";

interface Props {
  store: RoutePlanningStore;
  route: RoutePlanRoute;
  plan: RoutePlan;
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
            {this.props.plan.status === "succeeded" && this.props.route.slug
            ? <a href={historyHelper.getRouteUrl(`/routes/details/${this.props.route.slug}`)}>{this.props.route.slug}</a>
            : "--"}
          </div>
        </div>
      </div>
    );
  }
}
