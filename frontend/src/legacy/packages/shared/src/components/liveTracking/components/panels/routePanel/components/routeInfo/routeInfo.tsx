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
    let route = this.props.service.selectedListRoute;
    if (!route) {
      return null;
    }

    return (
      <div className="c-liveTracking-routePanel-routeInfo user-select-text">

        <RouteComponent
          service={this.props.service}
          route={route}
        />

      </div>
    );
  }
}
