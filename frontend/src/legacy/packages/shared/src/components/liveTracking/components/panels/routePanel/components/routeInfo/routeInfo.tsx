import React from "react";
import { observer } from "mobx-react";
import { RouteComponent } from "../../../routesPanel/components/route/route";
import { LiveTrackingService } from "../../../../../services/liveTrackingService";
import "./routeInfo.scss";

export interface RoutesLayerProps {
  service: LiveTrackingService;
}

@observer
export class RouteInfo extends React.Component<RoutesLayerProps> {
  public render() {
    const selectedRoute = this.props.service.selectedRoute;
    const currentRoute = selectedRoute ?? this.props.service.selectedListRoute;

    if (!currentRoute) {
      return null;
    }

    return (
      <div className="c-liveTracking-routePanel-routeInfo user-select-text">

        <RouteComponent
          service={this.props.service}
          route={currentRoute}
        />

      </div>
    );
  }
}
