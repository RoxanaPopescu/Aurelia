import React from "react";
import { observer } from "mobx-react";
import { LiveTrackingService } from "../../../services/liveTrackingService";
import { Panel } from "../panel";
import { Filters } from "./components/filters/filters";
import { RouteComponent } from "./components/route/route";
import "./routesPanel.scss";

export interface RoutesPanelProps {
  service: LiveTrackingService;
  hidden?: boolean;
}

@observer
export class RoutesPanel extends React.Component<RoutesPanelProps> {
  public render() {
    return (
      <Panel className="c-liveTracking-routesPanel" hidden={this.props.hidden}>
        <div className="c-liveTracking-panel-header">
          <Filters service={this.props.service} />
        </div>

        <div className="c-liveTracking-panel-body">
          {this.props.service.filteredRoutes &&
            this.props.service.filteredRoutes
              .map(route => (
                <RouteComponent
                  key={route.id}
                  service={this.props.service}
                />
              ))}
        </div>
      </Panel>
    );
  }
}
