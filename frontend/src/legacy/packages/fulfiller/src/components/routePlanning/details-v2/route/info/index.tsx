import React from "react";
import "./styles.scss";
import { RoutePlan, RoutePlanRoute } from "shared/src/model/logistics/routePlanning";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../../store";
import { Container } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";
import Localization from "shared/src/localization";

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
      <div className="c-routePlanning-routes-routeInfo">
        <div className="c-routePlanning-routes-route-infoContent">
          <div className="c-routePlanning-routes-route-id">
              {!this.props.store.plan.waitingForApproval && this.props.route.slug
              ? <a href={historyHelper.getRouteUrl(`/routes/details/${this.props.route.slug}`)}>{this.props.route.slug}</a>
              : this.props.route.slug || "--"}
          </div>
          <div className="c-routePlanning-routes-route-infoItem font-small">
              {this.props.route.vehicleType
              ? <>
                  <div className="c-routePlanning-routes-route-infoItem-title font-small">{Localization.sharedValue("Order_VehicleType")}</div>
                  <div className="c-routePlanning-routes-route-infoItem-description font-small">{this.props.route.vehicleType.name}</div>
                </>
              : "--"}
            </div>
        </div>
        <img
          src={require("./assets/zoom-in.svg")}
          className="c-routePlanning-routes-routeInfo-zoom"
          onClick={() => this.props.store.focusRoute(this.props.route)}
        />
      </div>
    );
  }
}
