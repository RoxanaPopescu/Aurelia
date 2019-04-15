import React from "react";
import { observer } from "mobx-react";
import { Route } from "shared/src/model/logistics/routes";
import { Route as TrackingRoute } from "shared/src/model/logistics/routes/tracking";
import { RoutesService } from "../../../services/routesService";
import { RouteDriverMarker } from "../../mapFeatures/routeDriverMarker/routeDriverMarker";
import "./routesLayer.scss";

export interface RoutesLayerProps {
  routesService: RoutesService;
}

@observer
export class RoutesLayer extends React.Component<RoutesLayerProps> {

  public render() {
    return (
      <React.Fragment>

        {this.props.routesService.routes && this.props.routesService.routes
        .filter(r => r.driverPosition != null)
        .map(r =>
        <RouteDriverMarker
          key={`RouteDriverMarker-${r.id}`}
          route={r}
          onClick={route => this.onClick(route)}
        />)}

      </React.Fragment>
    );
  }

  private onClick(route: Route): void {
    history.pushState({ ...history.state, state: { routeId: route.id }}, "", window.location.href);
    this.props.routesService.setSelectedRoute(route as TrackingRoute);
    this.props.routesService.selectedRouteStopId = route.currentOrNextStop ?
      route.currentOrNextStop.id : undefined;
  }
}
