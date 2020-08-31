import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { LiveTrackingService } from "../../../../../services/liveTrackingService";
import { Input, InputCheckbox, Icon, InputRadioGroup } from "shared/src/webKit";
import "./filters.scss";
import { observable } from "mobx";
import { RouteCriticality, RouteStatus } from "app/model/route";
import { ProductType } from "app/model/product";
import { VehicleType } from "shared/src/model/session";

export interface RoutesLayerProps {
  service: LiveTrackingService;
}

@observer
export class Filters extends React.Component<RoutesLayerProps> {
  @observable expanded = false;

  public render() {

    const highCriticalityCount = this.props.service.filteredRoutes
      .filter(r => r.criticality.slug === "high")
      .length;

    const mediumCriticalityCount = this.props.service.filteredRoutes
      .filter(r => r.criticality.slug === "medium")
      .length;

    const lowCriticalityCount = this.props.service.filteredRoutes.length - highCriticalityCount - mediumCriticalityCount;

    return (
      <div className="c-liveTracking-routesPanel-filters-outer ">
        <div className="c-liveTracking-routesPanel-filters">

        <div
        onClick={() => this.expanded ? this.expanded = false : this.expanded = true}
         className="c-liveTracking-routesPanel-filters-info c-liveTracking-box-clickable
        ">
          <span className="c-liveTracking-routesPanel-filters-criticality">
            <span className={"c-liveTracking-routesPanel-filters-badge c-liveTracking-box-negative"}>
              {highCriticalityCount}
            </span>
            <span className={"c-liveTracking-routesPanel-filters-badge c-liveTracking-box-warning"}>
              {mediumCriticalityCount}
            </span>
            <span className={"c-liveTracking-routesPanel-filters-badge c-liveTracking-box-gray"}>
              {lowCriticalityCount}
            </span>
          </span>
          <span className="c-liveTracking-routesPanel-filters-infoRight">
            <div>
              <div className="c-liveTracking-routesPanel-filters-enabledCount">
              {Localization.sharedValue("LiveTracking_FiltersEnabled")
            .replace("{enabled-filter}", this.props.service.filter.enabledCount.toString())}
              </div>
              <div className="c-liveTracking-routesPanel-filters-count">
              {Localization.sharedValue("Route_FilterCount")
            .replace("{filtered_count}", this.props.service.filteredRoutes.length.toString())
            .replace("{total_count}", this.props.service.routes.length.toString())}
              </div>
            </div>
            <Icon className="c-livetracking-filter" name="live-tracking-filter"/>
          </span>
        </div>
        <Input
          type="search"
          height="40"
          className="c-liveTracking-routesPanel-filters-input"
          value={this.props.service.filter.searchQuery}
          onChange={value =>
            this.props.service.filter.searchQuery = value || undefined}
          placeholder={Localization.sharedValue("Route_SearchForDriversRoutes")}
        />
        </div>
        {this.expanded &&
        <div className="c-liveTracking-routesPanel-filters-expandedOuter">
        <div className="c-liveTracking-routesPanel-filters-expanded">
          <div>
            <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Criticality")}</div>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.criticalityEnabled("high")}
              onChange={() => this.props.service.filter.criticalityEnableDisable("high")
              }
            >
              {new RouteCriticality("high").name} - {highCriticalityCount}
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.criticalityEnabled("medium")}
              onChange={() => this.props.service.filter.criticalityEnableDisable("medium")
              }
            >
              {new RouteCriticality("medium").name} - {mediumCriticalityCount}
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.criticalityEnabled("low")}
              onChange={() => this.props.service.filter.criticalityEnableDisable("low")
              }
            >
              {new RouteCriticality("low").name} - {lowCriticalityCount}
            </InputCheckbox>
          </div>
          <div>
            <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Statuses")}</div>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.statusEnabled("in-progress")}
              onChange={() => this.props.service.filter.statusEnableDisable("in-progress")
              }
            >
              {new RouteStatus("in-progress").name} - {
                this.props.service.filteredRoutes
                .filter(r => r.status.slug === "in-progress")
                .length
              }
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.statusEnabled("not-started")}
              onChange={() => this.props.service.filter.statusEnableDisable("not-started")
              }
            >
              {new RouteStatus("not-started").name} - {
                this.props.service.filteredRoutes
                .filter(r => r.status.slug === "not-started")
                .length
              }
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.statusEnabled("not-approved")}
              onChange={() => this.props.service.filter.statusEnableDisable("not-approved")
              }
            >
              {new RouteStatus("not-approved").name} - {
                this.props.service.filteredRoutes
                .filter(r => r.status.slug === "not-approved")
                .length
              }
            </InputCheckbox>
          </div>

          <div>
          <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Drivers")}</div>

            <InputRadioGroup
                radioButtons={[
                  { value: "both", headline: Localization.sharedValue("Not_Active") },
                  { value: "assigned", headline: Localization.sharedValue("Routes_Assigned_drivers") + " - " + this.props.service.filteredRoutes
                  .filter(r => r.driver != null)
                  .length },
                  { value: "not-assigned", headline: Localization.sharedValue("Routes_Not_Assigned_drivers") + " - " + this.props.service.filteredRoutes
                  .filter(r => r.driver == null)
                  .length }
                ]}
                onChange={value => {
                  if (value === "assigned") {
                    this.props.service.filter.assignedDriversChanged(true);
                  } else if (value === "not-assigned") {
                    this.props.service.filter.assignedDriversChanged(false);
                  } else {
                    this.props.service.filter.assignedDriversChanged(undefined);
                  }
                }}
                checkedValue={
                  this.props.service.filter.assignedToDriver == null ? "both" :
                  this.props.service.filter.assignedToDriver ? "assigned" : "not-assigned"
                }
              />
          </div>

          <div>
            <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Products")}</div>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.productEnabled("solution")}
              onChange={() => this.props.service.filter.productEnableDisable("solution")
              }
            >
              {new ProductType("solution").name} - {
                this.props.service.filteredRoutes
                .filter(r => r.productType.slug === "solution")
                .length
              }
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.productEnabled("courier-eco")}
              onChange={() => this.props.service.filter.productEnableDisable("courier-eco")
              }
            >
              {new ProductType("courier-eco").name} - {
                this.props.service.filteredRoutes
                .filter(r => r.productType.slug === "courier-eco")
                .length
              }
            </InputCheckbox>
            <InputCheckbox
              className="c-liveTracking-routesPanel-filters-criticality"
              checked={this.props.service.filter.productEnabled("courier-express")}
              onChange={() => this.props.service.filter.productEnableDisable("courier-express")
              }
            >
              {new ProductType("courier-express").name} - {
                this.props.service.filteredRoutes
                .filter(r => r.productType.slug === "courier-express")
                .length
              }
            </InputCheckbox>
          </div>
          <div>
            <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("RouteDetails_RouteOverview_VehicleType")}</div>
            {VehicleType.getAll().map(v =>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                key={v.id}
                checked={this.props.service.filter.vehicleTypeEnabled(v.slug)}
                onChange={() => this.props.service.filter.vehicleTypeEnableDisable(v.slug)
                }
              >
                {v.name} - {
                this.props.service.filteredRoutes
                .filter(r => r.vehicleType.slug === v.slug)
                .length
              }
              </InputCheckbox>
            )}
          </div>
        </div></div>}
      </div>
    );
  }
}
