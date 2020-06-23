import React from "react";
import { observer } from "mobx-react";
import { RouteStop, Route, RouteStopBase } from "shared/src/model/logistics/routes";
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

  renderStops() {
    const selectedRoute = this.props.routesService.selectedRoute;

    if (selectedRoute == null) {
      return <React.Fragment/>;
    }

    let stops: (RouteStop | RouteStopBase)[];
    let currentStopIndex = selectedRoute.currentStopIndex;
    if (selectedRoute.productType.slug != "solution" && currentStopIndex != null && currentStopIndex > 0) {
      stops = selectedRoute.stops.slice(currentStopIndex);
    } else {
      stops = selectedRoute.stops;
    }

    let nonCancelledStops = stops.filter(s =>
      s.status.slug !== "cancelled");

    let items: JSX.Element[] = [];

    let i = 0;
    for (let s of nonCancelledStops) {
      if (i > 0) {
        items.push(<RouteSegmentLine
          routeStops={[nonCancelledStops[i - 1], s]}
          key={`RouteSegmentLine-${nonCancelledStops[i - 1].id}-${s.id}`}
        />);
      }
      i++;
    }

    for (let s of stops) {
      if (s instanceof RouteStop) {
        items.push(<RouteStopMarker
          key={`RouteStopMarker-${s.id}`}
          routeStop={s}
          selectedRouteStopId={this.props.routesService.selectedRouteStopId}
          onClick={routeStop => this.onStopMarkerClick(routeStop)}
        />);
      }
    }

    return items;
  }

  public render() {
    const selectedRoute = this.props.routesService.selectedRoute;

    if (selectedRoute == null) {
      return <React.Fragment/>;
    }

    return (
      <React.Fragment>
        {this.renderStops()}
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
