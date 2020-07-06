import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Route as RouteModel } from "shared/src/model/logistics/routes/tracking";
import { RoutesServiceLegacy } from "../../../../../services/routesService";
import { routeFlagService } from "../../../../../services/routeFlagService";
import { Icon } from "shared/src/webKit";
import "./route.scss";
import { RouteStop } from "shared/src/model/logistics/routes";

export interface RoutesLayerProps {
  routesService: RoutesServiceLegacy;
  route: RouteModel;
}

@observer
export class Route extends React.Component<RoutesLayerProps> {

  public render() {

    const driverOrFulfillerName =
      this.props.route.driver
      ? this.props.route.driver.name.toString()
      : this.props.route.fulfiller.primaryName;

    const driverOrFulfillerPhone = this.props.route.driver
      ? this.props.route.driver.phone.toString()
      : this.props.route.fulfiller.contactPhone ? this.props.route.fulfiller.contactPhone!.toString()
      : undefined;

    const isFlagged = routeFlagService.isFlagged(this.props.route.id);

    let boxStyle: string = "c-liveTracking-box-neutral";
    if (this.props.route.criticality.slug == "high") {
      boxStyle = "c-liveTracking-box-negative";
    } else if (this.props.route.criticality.slug == "medium") {
      boxStyle = "c-liveTracking-box-warning";
    }

    return (
      <div
        className="c-liveTracking-routesPanel-route"
        onClick={() => this.onClick()}
      >
        <div className={"c-liveTracking-route-bar " + boxStyle} />
        <div>

          <div className="c-liveTracking-panel-section user-select-text suppress-double-click">

            <div className="c-liveTracking-panel-title c-liveTracking-routesPanel-route-title">
              <div
              className={`
                c-liveTracking-routesPanel-route-flag
                ${isFlagged ? "c-liveTracking-routesPanel-route-flag--active" : ""}`}
              onClick={event => this.onFlagClick(event)}
            >
              <Icon name="eye"/>
            </div>
            <div className="c-liveTracking-routesPanel-route-title-container">

              <div>

                {Localization.sharedValue("LiveTracking_Route_Title", {
                  slug: this.props.route.slug.length >= 30 ? (this.props.route.slug.substr(0, 10) + "...") : this.props.route.slug
                })}

                {this.props.route.reference &&
                <span>
                  <span className="c-liveTracking-routesPanel-route-title-refSeparator">–</span>
                  {this.props.route.reference}
                </span>}

              </div>

              <div className="c-liveTracking-routesPanel-route-owner">
                {this.props.route.owner?.companyName}
              </div>
              </div>
            </div>

            <div className="c-liveTracking-routesPanel-route-info">

              <div>{driverOrFulfillerName}</div>

              {driverOrFulfillerPhone &&
              <div>{driverOrFulfillerPhone}</div>}

              <div>{this.props.route.vehicleType.name}</div>

              {this.props.route.completedTime &&
              <div>{Localization.sharedValue("LiveTracking_Route_DoneTime", {
                time: Localization.formatTime(this.props.route.completedTime)
              })}</div>}

              {this.props.route.completedTime == null && this.props.route.estimates?.completionTime &&
              <div>{Localization.sharedValue("LiveTracking_Route_ExpectedDoneTime", {
                time: Localization.formatTime(this.props.route.estimates?.completionTime)
              })}</div>}

            </div>

          </div>

          {this.props.route.expectedDelays.length > 0 &&
          <div
            onClick={e => this.onDelayMessageClicked(e)}
            className={`
              c-liveTracking-panel-message
              c-liveTracking-box-clickable
              c-liveTracking-box-neutral`}
          >
            {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_ExpectedDelaysAtStop")}
            {" " + Localization.formatIntegersAsRanges(this.props.route.expectedDelays.map(s => s.stopNumber), 3)}
          </div>}
          {this.renderDriverOffline()}
          {this.renderNoDriver()}
        </div>

      </div>
    );
  }

  renderCancelledOrFailedStops(): JSX.Element | undefined {
    if (["completed", "cancelled"].includes(this.props.route.status.slug)) {
      return;
    }

    let problems = this.problemStops();
    if (problems.length <= 0) {
      return;
    }

    return (
      <div
          onClick={e => this.onFailedOrCancelledMessageClicked(e)}
          className={`
            c-liveTracking-panel-message
            c-liveTracking-box-clickable
            c-liveTracking-box-neutral
          `}
        >
          {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_CancelledOrFailedAtStop")}
          {" " + Localization.formatIntegersAsRanges(problems.map(s => s.stopNumber), 3)}
        </div>
    );
  }

  renderNoDriver(): JSX.Element | undefined {
    if (this.props.route.driver != null) {
      return;
    }

    let info = Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_NoneAssigned");
    let stop = this.props.route.stops[0];
    if (stop instanceof RouteStop && stop.arrivalTimeFrame.from != null) {
      info = info.replace("{time}", Localization.formatDateTime(stop.arrivalTimeFrame.from));
    }

    return (
      <div className={"c-liveTracking-panel-message c-liveTracking-box-neutral"}>
          {info}
      </div>
    );
  }

  renderDriverOffline(): JSX.Element | undefined {
    if (this.props.route.driverOnline || this.props.route.driver == null) {
      return;
    }

    if (["completed", "cancelled"].includes(this.props.route.status.slug)) {
      return;
    }

    return (
      <div className={"c-liveTracking-panel-message c-liveTracking-box-neutral"}>
          {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverOffline") + " (" + this.props.route.status.name + ")"}
      </div>
    );
  }

  private problemStops(): RouteStop[] {
    return this.props.route.stops.filter(
      s =>
        s instanceof RouteStop &&
        this.props.route.currentStopIndex &&
        this.props.route.currentStopIndex + 1 > s.stopNumber &&
        (s.status.slug === "cancelled" || s.status.slug === "failed")
    ) as RouteStop[];
  }

  private onClick(): void {
    if (this.props.routesService.selectedRouteId !== this.props.route.id) {
      this.props.routesService.setSelectedRoute(this.props.route);
      this.props.routesService.selectedRouteStopId = this.props.route.currentOrNextStop ?
        this.props.route.currentOrNextStop.id : undefined;
      history.pushState({ ...history.state, state: { routeId: this.props.route.id }}, "", window.location.href);
    }
  }

  private onFlagClick(event: React.MouseEvent): void {
    routeFlagService.toggleFlag(this.props.route.id);
    this.forceUpdate();
    this.props.routesService.triggerRoutesChanged();
    event.stopPropagation();
  }

  private onFailedOrCancelledMessageClicked(event: React.MouseEvent): void {
    if (this.props.routesService.selectedRouteId === this.props.route.id) {
      event.stopPropagation();
    }
    setTimeout(() => {
      // Needed to trigger change detection.
      this.props.routesService.selectedRouteStopId = undefined;
      this.props.routesService.selectedRouteStopId = this.problemStops[0].id;
    });
  }

  private onDelayMessageClicked(event: React.MouseEvent): void {
    if (this.props.routesService.selectedRouteId === this.props.route.id) {
      event.stopPropagation();
    }
    setTimeout(() => {
      // Needed to trigger change detection.
      this.props.routesService.selectedRouteStopId = undefined;
      this.props.routesService.selectedRouteStopId = this.props.route.expectedDelays[0].id;
    });
  }
}
