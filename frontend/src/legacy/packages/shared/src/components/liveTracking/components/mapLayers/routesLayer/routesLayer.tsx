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

  private renderRoute(route: TrackingRoute): JSX.Element {
    return (
      <RouteDriverMarker
          key={`RouteDriverMarker-${route.id}`}
          route={route}
          onClick={route => this.onClick(route)}
        />
    );
  }

  public render() {
    let routes = this.props.routesService.routes && this.props.routesService.routes
    .filter(r => r.containsText(this.props.routesService.textFilter));

    if (routes == null) {
      return;
    }

    return (
      <React.Fragment>
        {routes.map(r =>
          this.renderRoute(r)
        )}
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
