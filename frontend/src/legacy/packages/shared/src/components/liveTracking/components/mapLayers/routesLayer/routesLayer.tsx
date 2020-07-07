import React from "react";
import { observer } from "mobx-react";
import { LiveTrackingService } from "../../../services/liveTrackingService";
import { RouteDriverMarker } from "../../mapFeatures/routeDriverMarker/routeDriverMarker";
import "./routesLayer.scss";
import { RouteInfo } from "app/model/route";

export interface RoutesLayerProps {
  service: LiveTrackingService;
}

@observer
export class RoutesLayer extends React.Component<RoutesLayerProps> {

  private renderRoute(route: RouteInfo): JSX.Element {
    return (
      <RouteDriverMarker
          key={`RouteDriverMarker-${route.id}`}
          route={route}
          onClick={route => this.onClick(route)}
        />
    );
  }

  public render() {
    let routes = this.props.service.filteredRoutes;

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

  private onClick(route: RouteInfo): void {
    history.pushState({ ...history.state, state: { routeId: route.id }}, "", window.location.href);

    // FIXME: FETCH SINGLE ROUTE
    // this.props.service.setSelectedRoute(route as TrackingRoute);
    this.props.service.selectedRouteStopId = route.currentOrNextStop ?
      route.currentOrNextStop.id : undefined;
  }
}
