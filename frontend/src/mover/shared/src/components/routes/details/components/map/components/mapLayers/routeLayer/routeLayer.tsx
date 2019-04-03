import React from "react";
import { observer } from "mobx-react";
import { RouteStop, Route } from "shared/src/model/logistics/routes";
import { RouteStopMarker } 
  from "shared/src/components/liveTracking/components/mapFeatures/routeStopMarker/routeStopMarker";
import { RouteSegmentLine } 
  from "shared/src/components/liveTracking/components/mapFeatures/routeSegmentLine/routeSegmentLine";
import { RouteDriverMarker } 
  from "shared/src/components/liveTracking/components/mapFeatures/routeDriverMarker/routeDriverMarker";
import "./routeLayer.scss";
import { RouteDetailsService } from "../../../../../routeDetailsService";

export interface RouteLayerProps {
  routeDetailsService: RouteDetailsService;
}

@observer
export class RouteLayer extends React.Component<RouteLayerProps> {

  public render() {
    const route = this.props.routeDetailsService.routeDetails;

    if (route == null) {
      return <React.Fragment/>;
    }

    return (
      <React.Fragment>

        {route.stops
          .filter(s =>
            !s.status.slug.startsWith("cancelled"))
          .map((s, i, a) => i > 0 &&
          <RouteSegmentLine
            routeStops={[a[i - 1], s]}
            key={`RouteSegmentLine-${a[i - 1].id}-${s.id}`}
          />)}

        {route.stops
          .map(s => s instanceof RouteStop &&
          <RouteStopMarker
            key={`RouteStopMarker-${s.id}`}
            routeStop={s}
            onClick={routeStop => this.onStopMarkerClick(routeStop)}
          />)}

        {route.driverPosition &&
        <RouteDriverMarker
          key={`RouteDriverMarker-${route.id}`}
          route={route}
          onClick={r => this.onDriverMarkerClick(r)}
        />}

      </React.Fragment>
    );
  }

  private onDriverMarkerClick(route: Route): void {
    // TODO: Scroll to current stop.
  }

  private onStopMarkerClick(routeStop: RouteStop) {
    // TODO: Scroll to stop.
  }
}
