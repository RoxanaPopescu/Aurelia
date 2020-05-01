import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Route as RouteModel } from "shared/src/model/logistics/routes/tracking";
import { RoutesService } from "../../../../../services/routesService";
import { routeFlagService } from "../../../../../services/routeFlagService";
import { Icon } from "shared/src/webKit";
import "./route.scss";

export interface RoutesLayerProps {
  routesService: RoutesService;
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

    return (
      <div
        className="c-liveTracking-routesPanel-route"
        onClick={() => this.onClick()}
      >
        <div>

          <div
            className={`
              c-liveTracking-routesPanel-route-flag
              ${isFlagged ? "c-liveTracking-routesPanel-route-flag--active" : ""}`}
            onClick={event => this.onFlagClick(event)}
          >
            <Icon name="eye"/>
          </div>

        </div>

        <div>

          <div className="c-liveTracking-panel-section user-select-text suppress-double-click">

            <div className="c-liveTracking-panel-title c-liveTracking-routesPanel-route-title">

              <div>

                {Localization.sharedValue("LiveTracking_Route_Title", {
                  slug: this.props.route.slug
                })}

                {this.props.route.reference &&
                <span>
                  <span className="c-liveTracking-routesPanel-route-title-refSeparator">–</span>
                  {this.props.route.reference}
                </span>}

              </div>

              <div>
                {this.props.route.owner?.companyName}
              </div>

            </div>

            <div className="c-liveTracking-routesPanel-route-info">

              <div>{driverOrFulfillerName}</div>

              {driverOrFulfillerPhone &&
              <div>{driverOrFulfillerPhone}</div>}

              {this.props.route.driverVehicle &&
              <div>{this.props.route.driverVehicle.vehicleType.name}</div>}

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
              c-liveTracking-box-${this.props.route.criticality.slug === "high" ? "negative" : "warning"}
            `}
          >
            {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_ExpectedDelaysAtStop")}
            {" " + Localization.formatIntegersAsRanges(this.props.route.expectedDelays.map(s => s.stopNumber), 3)}
          </div>}

          {!this.props.route.driverOnline && !["completed", "cancelled"].includes(this.props.route.status.slug) &&
          <div className="c-liveTracking-panel-message c-liveTracking-box-negative">
            {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverOffline") + " (" + this.props.route.status.name + ")"}
          </div>}

        </div>

      </div>
    );
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
