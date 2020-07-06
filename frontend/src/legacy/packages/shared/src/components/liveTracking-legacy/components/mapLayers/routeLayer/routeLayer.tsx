import React from "react";
import { observer } from "mobx-react";
import { RouteStop, Route } from "shared/src/model/logistics/routes";
import { RouteStopMarker } from "../../mapFeatures/routeStopMarker/routeStopMarker";
import { RouteSegmentLine } from "../../mapFeatures/routeSegmentLine/routeSegmentLine";
import { RouteDriverMarker } from "../../mapFeatures/routeDriverMarker/routeDriverMarker";
import "./routeLayer.scss";
import { RoutesServiceLegacy } from "../../../services/routesService";
import { DriverMarker } from "../../mapFeatures/driverMarker/driverMarker";

export interface RouteLayerProps {
  routesService: RoutesServiceLegacy;
}

@observer
export class RouteLayer extends React.Component<RouteLayerProps> {
  renderDrivers() {
    const drivers = this.props.routesService.drivers;

    if (drivers == null) {
      return <React.Fragment/>;
    }

    let items: JSX.Element[] = [];

    for (let d of drivers) {
      items.push(<DriverMarker
        driver={d}
        key={`Driver-${d.id}`}
        onClick={driver =>  this.props.routesService.onSelectDriver(driver)}
      />);
    }

    return items;
  }

  renderStops() {
    const selectedRoute = this.props.routesService.selectedRoute;

    if (selectedRoute == null) {
      return <React.Fragment/>;
    }

    let stops = selectedRoute.stops;
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
          faded={s.status.slug === "cancelled" || s.status.slug === "completed"}
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
        {this.renderDrivers()}
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
