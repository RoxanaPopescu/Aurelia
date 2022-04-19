import React from "react";
import { Container } from "aurelia-framework";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { LiveTrackingService } from "../../../../../services/liveTrackingService";
import { Input, InputCheckbox, Icon, InputRadioGroup, MultiSelect } from "shared/src/webKit";
import "./filters.scss";
import { observable } from "mobx";
import { RouteCriticality, RouteStatus } from "app/model/route";
import { ProductType } from "app/model/product";
import { VehicleType } from "app/model/vehicle";
import { TeamsFilterService } from "app/services/teams-filter";

export interface RoutesLayerProps {
  service: LiveTrackingService;
}

@observer
export class Filters extends React.Component<RoutesLayerProps> {
  @observable expanded = false;
  teamsFilterService: TeamsFilterService

  public constructor(props)
  {
    super(props);

    this.teamsFilterService = Container.instance.get(TeamsFilterService)
  }

  public componentWillMount()
  {
    this.teamsFilterService.fetchAccessibleTeams();
    this.props.service.filter.selectedTeamCount = this.teamsFilterService.selectedTeamIds?.length ?? 0;
  }

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
          onClick={() =>
            {
              this.expanded ? this.expanded = false : this.expanded = true;
              this.props.service.filtersExpanded = this.expanded;
            }}
          className="c-liveTracking-routesPanel-filters-info c-liveTracking-box-clickable">
            <span className="c-liveTracking-routesPanel-filters-criticality">
              <span className={"c-liveTracking-routesPanel-filters-badge --negative"} title="High criticality">
                <span>{highCriticalityCount}</span>
              </span>
              <span className={"c-liveTracking-routesPanel-filters-badge --attention"} title="Medium criticality">
                <span>{mediumCriticalityCount}</span>
              </span>
              <span className={"c-liveTracking-routesPanel-filters-badge --neutral"} title="Low criticality">
                <span>{lowCriticalityCount}</span>
              </span>
            </span>
            <span className="c-liveTracking-routesPanel-filters-infoRight">
              <div>
                <span className="c-liveTracking-routesPanel-filters-enabledCount">
                {Localization.sharedValue("LiveTracking_FiltersEnabled")
                  .replace("{enabled-filter}", this.props.service.filter.enabledCount.toString())}
                </span>
                <span className="c-liveTracking-routesPanel-filters-count">
                {Localization.sharedValue("Route_FilterCount")
                  .replace("{filtered_count}", this.props.service.filteredRoutes.length.toString())
                  .replace("{total_count}", this.props.service.routes.length.toString())}
                </span>
              </div>
              <Icon className="c-livetracking-filter" name={this.expanded ? "clear" : "md-filter"}/>
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
              <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Teams")}</div>
              <MultiSelect
                size={"medium"}
                onChange={values => {
                  this.teamsFilterService.selectedTeamIds = values?.length ? values?.map(t => t.value) : undefined;
                  this.props.service.filter.selectedTeamCount = this.teamsFilterService.selectedTeamIds?.length ?? 0;
                  this.props.service.restartPolling();
                }}
                options={(this.teamsFilterService.accessibleTeams ?? []).map((t: any) => {
                  return { label: t.name ?? "No team", value: t.id ?? "no-team" };
                })}
                values={(this.teamsFilterService.selectedTeams ?? []).map((t: any) => {
                  return { label: t.name ?? "No team", value: t.id ?? "no-team" };
                })}
              />
            </div>
            <div>
              <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Criticality")}</div>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                checked={this.props.service.filter.criticalityEnabled("high")}
                onChange={() => this.props.service.filter.criticalityEnableDisable("high")
                }
              >
                {new RouteCriticality("high").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{highCriticalityCount}</span>
              </InputCheckbox>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                checked={this.props.service.filter.criticalityEnabled("medium")}
                onChange={() => this.props.service.filter.criticalityEnableDisable("medium")
                }
              >
                {new RouteCriticality("medium").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{mediumCriticalityCount}</span>
              </InputCheckbox>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                checked={this.props.service.filter.criticalityEnabled("low")}
                onChange={() => this.props.service.filter.criticalityEnableDisable("low")
                }
              >
                {new RouteCriticality("low").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{lowCriticalityCount}</span>
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
                {new RouteStatus("in-progress").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{
                  this.props.service.filteredRoutes
                  .filter(r => r.status.slug === "in-progress")
                  .length
                }</span>
              </InputCheckbox>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                checked={this.props.service.filter.statusEnabled("not-started")}
                onChange={() => this.props.service.filter.statusEnableDisable("not-started")
                }
              >
                {new RouteStatus("not-started").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{
                  this.props.service.filteredRoutes
                  .filter(r => r.status.slug === "not-started")
                  .length
                }</span>
              </InputCheckbox>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                checked={this.props.service.filter.statusEnabled("not-approved")}
                onChange={() => this.props.service.filter.statusEnableDisable("not-approved")
                }
              >
                {new RouteStatus("not-approved").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{
                  this.props.service.filteredRoutes
                  .filter(r => r.status.slug === "not-approved")
                  .length
                }</span>
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
              <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("RouteDetails_RouteOverview_VehicleType")}</div>
              {VehicleType.getAll().map(v =>
                <InputCheckbox
                  className="c-liveTracking-routesPanel-filters-criticality"
                  key={v.id}
                  checked={this.props.service.filter.vehicleTypeEnabled(v.slug)}
                  onChange={() => this.props.service.filter.vehicleTypeEnableDisable(v.slug)
                  }
                >
                  {v.name} <span className="c-liveTracking-routesPanel-filters-matchCount">{
                  this.props.service.filteredRoutes
                  .filter(r => r.vehicleType.slug === v.slug)
                  .length
                }</span>
                </InputCheckbox>
              )}
            </div>
            <div>
              <div className="c-liveTracking-routesPanel-filters-title">{Localization.sharedValue("Products")}</div>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                checked={this.props.service.filter.productEnabled("solution")}
                onChange={() => this.props.service.filter.productEnableDisable("solution")
                }
              >
                {new ProductType("solution").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{
                  this.props.service.filteredRoutes
                  .filter(r => r.productType.slug === "solution")
                  .length
                }</span>
              </InputCheckbox>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                checked={this.props.service.filter.productEnabled("courier-eco")}
                onChange={() => this.props.service.filter.productEnableDisable("courier-eco")
                }
              >
                {new ProductType("courier-eco").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{
                  this.props.service.filteredRoutes
                  .filter(r => r.productType.slug === "courier-eco")
                  .length
                }</span>
              </InputCheckbox>
              <InputCheckbox
                className="c-liveTracking-routesPanel-filters-criticality"
                checked={this.props.service.filter.productEnabled("courier-express")}
                onChange={() => this.props.service.filter.productEnableDisable("courier-express")
                }
              >
                {new ProductType("courier-express").name} <span className="c-liveTracking-routesPanel-filters-matchCount">{
                  this.props.service.filteredRoutes
                  .filter(r => r.productType.slug === "courier-express")
                  .length
                }</span>
              </InputCheckbox>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
