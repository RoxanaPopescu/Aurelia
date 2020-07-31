import React from "react";
import { observer } from "mobx-react";
import { LiveTrackingService } from "../../../services/liveTrackingService";
import { RouteDriverMarker } from "../../mapFeatures/routeDriverMarker/routeDriverMarker";
import "./routesLayer.scss";
import { RouteInfo } from "app/model/route";
import { DriverMarker } from "../../mapFeatures/driverMarker/driverMarker";

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
          faded={this.props.service.onlineDrivers != null}
          onClick={route => this.onClick(route)}
        />
    );
  }

  public render() {
    let routes = this.props.service.filteredRoutes;

    return (
      <React.Fragment>
        {routes.map(r =>
          this.renderRoute(r)
        )}

        { this.props.service.onlineDrivers != null &&
          this.props.service.onlineDrivers.map(d =>
            <DriverMarker faded={false} driver={d} key={"online-driver" + d.id} />
          )
        }
      </React.Fragment>
    );
  }

  private onClick(route: RouteInfo): void {
    history.pushState({ ...history.state, state: { routeSlug: route.slug }}, "", window.location.href);
    this.props.service.setSelectedRouteSlug(route.slug);
    this.props.service.selectedRouteStopId = route.currentOrNextStop ?
      route.currentOrNextStop.id : undefined;
  }
}
