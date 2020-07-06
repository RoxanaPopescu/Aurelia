import React from "react";
import { observer } from "mobx-react";
import { Route as RouteModel } from "shared/src/model/logistics/routes/tracking";
import { Route } from "../../../routesPanel/components/route/route";
import { RoutesServiceLegacy } from "../../../../../services/routesService";
import "./routeInfo.scss";

export interface RoutesLayerProps {
  routesService: RoutesServiceLegacy;
  route: RouteModel;
}

@observer
export class RouteInfo extends React.Component<RoutesLayerProps> {

  public render() {
    return (
      <div className="c-liveTracking-routePanel-routeInfo user-select-text">

        <Route
          route={this.props.route}
          routesService={this.props.routesService}
        />

      </div>
    );
  }
}
