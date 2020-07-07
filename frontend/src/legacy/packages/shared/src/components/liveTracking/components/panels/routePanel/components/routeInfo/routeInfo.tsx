import React from "react";
import { observer } from "mobx-react";
import { RouteComponent } from "../../../routesPanel/components/route/route";
import { LiveTrackingService } from "../../../../../services/liveTrackingService";
import "./routeInfo.scss";
import { Route } from "app/model/route";

export interface RoutesLayerProps {
  service: LiveTrackingService;
  route: Route;
}

@observer
export class RouteInfo extends React.Component<RoutesLayerProps> {

  public render() {
    return (
      <div className="c-liveTracking-routePanel-routeInfo user-select-text">

        <RouteComponent
          service={this.props.service}
        />

      </div>
    );
  }
}
