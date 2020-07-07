import React from "react";
import { observer } from "mobx-react";
import { RouteStopMarker } from "../../mapFeatures/routeStopMarker/routeStopMarker";
import { RouteSegmentLine } from "../../mapFeatures/routeSegmentLine/routeSegmentLine";
import { RouteDriverMarker } from "../../mapFeatures/routeDriverMarker/routeDriverMarker";
import "./routeLayer.scss";
import { LiveTrackingService } from "../../../services/liveTrackingService";
import { DriverMarker } from "../../mapFeatures/driverMarker/driverMarker";
import { RouteStop, Route } from "app/model/route";

export interface RouteLayerProps {
  service: LiveTrackingService;
}

@observer
export class RouteLayer extends React.Component<RouteLayerProps> {
  renderDrivers() {
    const drivers = this.props.service.drivers;

    if (drivers == null) {
      return <React.Fragment/>;
    }

    let items: JSX.Element[] = [];

    for (let d of drivers) {
      items.push(<DriverMarker
        driver={d}
        key={`Driver-${d.id}`}
        onClick={driver =>  this.props.service.onSelectDriver(driver)}
      />);
    }

    return items;
  }

  renderStops() {
    const selectedRoute = this.props.service.selectedRoute;

    if (selectedRoute == null) {
      return <React.Fragment/>;
    }

    let stops = selectedRoute.stops;
    let nonCancelledStops = stops.filter(s =>
      s.status.slug !== "cancelled");

    // Remove info stops FIXME:

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
          selectedRouteStopId={this.props.service.selectedRouteStopId}
          onClick={routeStop => this.onStopMarkerClick(routeStop)}
          faded={s.status.slug === "cancelled" || s.status.slug === "completed"}
        />);
      }
    }

    return items;
  }

  public render() {
    const selectedRoute = this.props.service.selectedRoute;

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
          onClick={() => this.onDriverMarkerClick(selectedRoute)}
        />}
        {this.renderDrivers()}
      </React.Fragment>
    );
  }

  private onDriverMarkerClick(route: Route): void {
    // Needed to trigger change detection.
    this.props.service.selectedRouteStopId = undefined;
    this.props.service.selectedRouteStopId = route.currentOrNextStop ?
      route.currentOrNextStop.id : undefined;
  }

  private onStopMarkerClick(routeStop: RouteStop) {
    if (this.props.service != null) {
      // Needed to trigger change detection.
      this.props.service.selectedRouteStopId = undefined;
      this.props.service.selectedRouteStopId = routeStop.id;
    }
  }
}
