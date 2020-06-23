import React from "react";
import { observer } from "mobx-react";
import { RoutesService } from "../../../services/routesService";
import { Panel } from "../panel";
import { Filters } from "./components/filters/filters";
import { Route } from "./components/route/route";
import "./routesPanel.scss";

export interface RoutesPanelProps {
  routesService: RoutesService;
  hidden?: boolean;
}

@observer
export class RoutesPanel extends React.Component<RoutesPanelProps> {
  public render() {
    return (
      <Panel className="c-liveTracking-routesPanel" hidden={this.props.hidden}>
        <div className="c-liveTracking-panel-header">
          <Filters routesService={this.props.routesService} />
        </div>

        <div className="c-liveTracking-panel-body">
          {this.props.routesService.filteredRoutes &&
            this.props.routesService.filteredRoutes
              .map(route => (
                <Route
                  key={route.id}
                  routesService={this.props.routesService}
                  route={route}
                />
              ))}
        </div>
      </Panel>
    );
  }
}
