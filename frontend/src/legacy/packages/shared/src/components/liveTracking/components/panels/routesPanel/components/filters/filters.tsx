import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { RoutesService } from "../../../../../services/routesService";
import { RouteCriticality } from "shared/src/model/logistics/routes";
import { InputCheckbox, Input } from "shared/src/webKit";
import "./filters.scss";

export interface RoutesLayerProps {
  routesService: RoutesService;
}

// The criticality levels that are considered "important".
const importantCriticalityLevels = ["high", "medium"] as (keyof typeof RouteCriticality.map)[];

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
          checked={this.props.routesService.filter.criticality != null}
          onChange={active =>
            this.props.routesService.setFilter({ criticality: active ? importantCriticalityLevels : undefined })}
        >
          {Localization.sharedValue("LiveTracking_Filters_Criticality_Label")}

          {highCriticalityCount > 0 &&
          <span className="c-liveTracking-routesPanel-filters-badge c-liveTracking-box-negative">
            {highCriticalityCount}
          </span>}

          {mediumCriticalityCount > 0 &&
          <span className="c-liveTracking-routesPanel-filters-badge c-liveTracking-box-warning">
            {mediumCriticalityCount}
          </span>}

        </InputCheckbox>

        <Input
          type="search"
          className="c-liveTracking-routesPanel-filters-input"
          value={this.props.routesService.textFilter}
          onChange={value =>
            this.props.routesService.textFilter = value || undefined}
          placeholder={Localization.sharedValue("Input_Placeholder_Filter")}
        />

      </div>
    );
  }
}
