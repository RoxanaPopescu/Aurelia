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
          faded={false}
          onClick={route => this.onClick(route)}
          onSendSms={(driver) => this.props.service.sendSms(driver)}
        />
    );
  }

  public render() {
    let routes = this.props.service.filteredRoutes;

    return (
      <React.Fragment>

        { this.props.service.onlineDrivers == null &&
          routes.map(r =>
            this.renderRoute(r)
          )
        }

        { this.props.service.onlineDrivers != null &&
          this.props.service.onlineDrivers.map(d =>
            <DriverMarker
              faded={false}
              driver={d}
              key={"online-driver" + d.id}
              onSendSms={(driver) => this.props.service.sendSms(driver)}
            />
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
