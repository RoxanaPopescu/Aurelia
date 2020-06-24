import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { RoutesService } from "../../../../../services/routesService";
import { InputCheckbox, Input } from "shared/src/webKit";
import "./filters.scss";

export interface RoutesLayerProps {
  routesService: RoutesService;
}

@observer
export class Filters extends React.Component<RoutesLayerProps> {

  public render() {
    const highCriticalityCount = this.props.routesService.filteredRoutes
      ? this.props.routesService.filteredRoutes
        .filter(r => r.criticality.slug === "high")
        .length
      : 0;

    const mediumCriticalityCount = this.props.routesService.filteredRoutes
      ? this.props.routesService.filteredRoutes
        .filter(r => r.criticality.slug === "medium")
        .length
      : 0;

    return (
      <div className="c-liveTracking-routesPanel-filters">

        <InputCheckbox
          className="c-liveTracking-routesPanel-filters-criticality"
          checked={this.props.routesService.filter.criticalities.length > 0}
          onChange={active => {
              if (active) {
                this.props.routesService.filter.criticalities = ["high", "medium"];
              } else {
                this.props.routesService.filter.criticalities = [];
              }
            }
          }
        >
          {Localization.sharedValue("LiveTracking_Filters_Criticality_Label")}

          <span className={"c-liveTracking-routesPanel-filters-badge " + (highCriticalityCount > 0 ? "c-liveTracking-box-negative" : "")}>
            {highCriticalityCount}
          </span>

          <span className={"c-liveTracking-routesPanel-filters-badge " + (mediumCriticalityCount > 0 ? "c-liveTracking-box-warning" : "")}>
            {mediumCriticalityCount}
          </span>

        </InputCheckbox>

        <Input
          type="search"
          className="c-liveTracking-routesPanel-filters-input"
          value={this.props.routesService.filter.searchQuery}
          onChange={value =>
            this.props.routesService.filter.searchQuery = value || undefined}
          placeholder={Localization.sharedValue("Input_Placeholder_Filter")}
        />

      </div>
    );
  }
}
