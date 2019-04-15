import React from "react";
import { observer } from "mobx-react";
import { RouteStop, Route } from "shared/src/model/logistics/routes";
import { RouteStopMarker } from "../../mapFeatures/routeStopMarker/routeStopMarker";
import { RouteSegmentLine } from "../../mapFeatures/routeSegmentLine/routeSegmentLine";
import { RouteDriverMarker } from "../../mapFeatures/routeDriverMarker/routeDriverMarker";
import "./routeLayer.scss";
import { RoutesService } from "../../../services/routesService";

export interface RouteLayerProps {
  routesService: RoutesService;
}

@observer
export class RouteLayer extends React.Component<RouteLayerProps> {

  public render() {
    const selectedRoute = this.props.routesService.selectedRoute;

    if (selectedRoute == null) {
      return <React.Fragment/>;
    }

    return (
      <React.Fragment>

        {selectedRoute.stops
          .filter(s =>
            !s.status.slug.startsWith("cancelled"))
          .map((s, i, a) => i > 0 &&
          <RouteSegmentLine
            routeStops={[a[i - 1], s]}
            key={`RouteSegmentLine-${a[i - 1].id}-${s.id}`}
          />)}

        {selectedRoute.stops
          .map(s => s instanceof RouteStop &&
          <RouteStopMarker
            key={`RouteStopMarker-${s.id}`}
            routeStop={s}
            selectedRouteStopId={this.props.routesService.selectedRouteStopId}
            onClick={routeStop => this.onStopMarkerClick(routeStop)}
          />)}

        {selectedRoute.driverPosition &&
        <RouteDriverMarker
          key={`RouteDriverMarker-${selectedRoute.id}`}
          route={selectedRoute}
          onClick={route => this.onDriverMarkerClick(route)}
        />}

      </React.Fragment>
    );
  }

  private onDriverMarkerClick(route: Route): void {
    // Needed to trigger change detection.
    this.props.routesService.selectedRouteStopId = undefined;
    this.props.routesService.selectedRouteStopId = route.currentOrNextStop ?
      route.currentOrNextStop.id : undefined;
  }

  private onStopMarkerClick(routeStop: RouteStop) {
    if (this.props.routesService != null) {
      // Needed to trigger change detection.
      this.props.routesService.selectedRouteStopId = undefined;
      this.props.routesService.selectedRouteStopId = routeStop.id;
    }
  }
}
