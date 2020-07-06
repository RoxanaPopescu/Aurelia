import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { RoutesServiceLegacy } from "../../../../../services/routesService";
import { Input, InputCheckbox } from "shared/src/webKit";
import "./filters.scss";
import { observable } from "mobx";
import { RouteCriticality, RouteStatus } from "app/model/route";
import { ProductType } from "app/model/product";
import { VehicleType } from "shared/src/model/session";

export interface RoutesLayerProps {
  routesService: RoutesServiceLegacy;
}

@observer
export class Filters extends React.Component<RoutesLayerProps> {
  @observable expanded = false;

  public render() {

    const highCriticalityCount = this.props.routesService.filteredRoutes
      .filter(r => r.criticality.slug === "high")
      .length;

    const mediumCriticalityCount = this.props.routesService.filteredRoutes
      .filter(r => r.criticality.slug === "medium")
      .length;

    return (
      <React.Fragment>
        <div className="c-liveTracking-routesPanel-filters">

        <div
        onClick={() => this.expanded ? this.expanded = false : this.expanded = true}
         className="
        c-liveTracking-routesPanel-filters-info
        c-liveTracking-box-clickable
        c-liveTracking-routesPanel-filters
        ">
          <span className="c-liveTracking-routesPanel-filters-criticality">
            <span className={"c-liveTracking-routesPanel-filters-badge c-liveTracking-box-negative"}>
              {highCriticalityCount}
            </span>
            <span className={"c-liveTracking-routesPanel-filters-badge c-liveTracking-box-warning"}>
              {mediumCriticalityCount}
            </span>
            <span className={"c-liveTracking-routesPanel-filters-badge c-liveTracking-box-white"}>
              {this.props.routesService.filteredRoutes.length - highCriticalityCount - mediumCriticalityCount}
            </span>
          </span>
          {Localization.sharedValue("LiveTracking_FiltersEnabled")
          .replace("{enabled-filter}", this.props.routesService.filter.enabledCount.toString())}
        </div>

        <Input
          type="search"
          className="c-liveTracking-routesPanel-filters-input"
          value={this.props.routesService.filter.searchQuery}
          onChange={value =>
            this.props.routesService.filter.searchQuery = value || undefined}
          placeholder={Localization.sharedValue("Input_Placeholder_Filter")}
        />
        </div>
        {this.expanded &&
        <div className="c-liveTracking-routesPanel-filters-expanded">
          <div>
            <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Criticality")}</div>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.criticalityEnabled("high")}
              onChange={() => this.props.routesService.filter.criticalityEnableDisable("high")
              }
            >
              {new RouteCriticality("high").name}
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.criticalityEnabled("medium")}
              onChange={() => this.props.routesService.filter.criticalityEnableDisable("medium")
              }
            >
              {new RouteCriticality("medium").name}
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.criticalityEnabled("low")}
              onChange={() => this.props.routesService.filter.criticalityEnableDisable("low")
              }
            >
              {new RouteCriticality("low").name}
            </InputCheckbox>
          </div>
          <div>
            <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Statuses")}</div>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.statusEnabled("in-progress")}
              onChange={() => this.props.routesService.filter.statusEnableDisable("in-progress")
              }
            >
              {new RouteStatus("in-progress").name}
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.statusEnabled("not-started")}
              onChange={() => this.props.routesService.filter.statusEnableDisable("not-started")
              }
            >
              {new RouteStatus("not-started").name}
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.statusEnabled("not-approved")}
              onChange={() => this.props.routesService.filter.statusEnableDisable("not-approved")
              }
            >
              {new RouteStatus("not-approved").name}
            </InputCheckbox>
          </div>
          <div>
            <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Products")}</div>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.productEnabled("solution")}
              onChange={() => this.props.routesService.filter.productEnableDisable("solution")
              }
            >
              {new ProductType("solution").name}
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.productEnabled("courier-eco")}
              onChange={() => this.props.routesService.filter.productEnableDisable("courier-eco")
              }
            >
              {new ProductType("courier-eco").name}
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.routesService.filter.productEnabled("courier-express")}
              onChange={() => this.props.routesService.filter.productEnableDisable("courier-express")
              }
            >
              {new ProductType("courier-express").name}
            </InputCheckbox>
          </div>
          <div>
            <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("RouteDetails_RouteOverview_VehicleType")}</div>
            {VehicleType.getAll().map(v =>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                key={v.id}
                checked={this.props.routesService.filter.vehicleTypeEnabled(v.slug)}
                onChange={() => this.props.routesService.filter.vehicleTypeEnableDisable(v.slug)
                }
              >
                {v.name}
              </InputCheckbox>
            )}
          </div>
        </div>}
      </React.Fragment>
    );
  }
}
