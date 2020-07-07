import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { LiveTrackingService } from "../../../../../services/liveTrackingService";
import { routeFlagService } from "../../../../../services/routeFlagService";
import { Icon } from "shared/src/webKit";
import "./route.scss";
import { RouteStop } from "shared/src/model/logistics/routes";
import { Route } from "app/model/route";

export interface RoutesLayerProps {
  service: LiveTrackingService;
}

@observer
export class RouteComponent extends React.Component<RoutesLayerProps> {

  public render() {
    let route = this.props.service.selectedRoute;

    if (route == null) {
      // FIXME: SHOW LOADING
      return;
    }

    const driverOrFulfillerName =
      route.driver
      ? route.driver.name.toString()
      : route.fulfiller.primaryName;

    const driverOrFulfillerPhone = route.driver
      ? route.driver.phone.toString()
      : route.fulfiller.contactPhone ? route.fulfiller.contactPhone!.toString()
      : undefined;

    const isFlagged = routeFlagService.isFlagged(route.id);

    let boxStyle: string = "c-liveTracking-box-neutral";
    if (route.criticality.slug == "high") {
      boxStyle = "c-liveTracking-box-negative";
    } else if (route.criticality.slug == "medium") {
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
                  slug: route.slug.length >= 30 ? (route.slug.substr(0, 10) + "...") : route.slug
                })}

                {route.reference &&
                <span>
                  <span className="c-liveTracking-routesPanel-route-title-refSeparator">–</span>
                  {route.reference}
                </span>}

              </div>

              <div className="c-liveTracking-routesPanel-route-owner">
                {route.owner?.companyName}
              </div>
              </div>
            </div>

            <div className="c-liveTracking-routesPanel-route-info">

              <div>{driverOrFulfillerName}</div>

              {driverOrFulfillerPhone &&
              <div>{driverOrFulfillerPhone}</div>}

              <div>{route.vehicleType.name}</div>

              {route.completedTime &&
              <div>{Localization.sharedValue("LiveTracking_Route_DoneTime", {
                time: Localization.formatTime(route.completedTime)
              })}</div>}

              {route.completedTime == null && route.estimates?.completionTime &&
              <div>{Localization.sharedValue("LiveTracking_Route_ExpectedDoneTime", {
                time: Localization.formatTime(route.estimates?.completionTime)
              })}</div>}

            </div>

          </div>

          {route.expectedDelays.length > 0 &&
          <div
            onClick={e => this.onDelayMessageClicked(e)}
            className={`
              c-liveTracking-panel-message
              c-liveTracking-box-clickable
              c-liveTracking-box-neutral`}
          >
            {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_ExpectedDelaysAtStop")}
            {" " + Localization.formatIntegersAsRanges(route.expectedDelays.map(s => s.stopNumber), 3)}
          </div>}
          {this.renderDriverOffline(route)}
          {this.renderNoDriver(route)}
        </div>

      </div>
    );
  }

  renderNoDriver(route: Route): JSX.Element | undefined {
    if (route.driver != null) {
      return;
    }

    let info = Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_NoneAssigned");
    let stop = route.stops[0];
    if (stop instanceof RouteStop && stop.arrivalTimeFrame.from != null) {
      info = info.replace("{time}", Localization.formatDateTime(stop.arrivalTimeFrame.from));
    }

    return (
      <div className={"c-liveTracking-panel-message c-liveTracking-box-neutral"}>
          {info}
      </div>
    );
  }

  renderDriverOffline(route): JSX.Element | undefined {
    if (route.driverOnline || route.driver == null) {
      return;
    }

    if (["completed", "cancelled"].includes(route.status.slug)) {
      return;
    }

    return (
      <div className={"c-liveTracking-panel-message c-liveTracking-box-neutral"}>
          {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverOffline") + " (" + route.status.name + ")"}
      </div>
    );
  }

  private onClick(): void {
    /*
    if (this.props.service.selectedRouteId !== route.id) {
      // this.props.service.setSelectedRoute(route);

      // FIXME: SELECT STOP ID
      // this.props.service.selectedRouteStopId = route.currentOrNextStop ?
      // route.currentOrNextStop.id : undefined;

      // FIXME: History state
      //history.pushState({ ...history.state, state: { routeId: route.id }}, "", window.location.href);
    }
    */
  }

  private onFlagClick(event: React.MouseEvent): void {
    // routeFlagService.toggleFlag(route.id);
    this.forceUpdate();
    this.props.service.triggerRoutesChanged();
    event.stopPropagation();
  }

  private onDelayMessageClicked(event: React.MouseEvent): void {
    /*
    if (this.props.service.selectedRouteId === route.id) {
      event.stopPropagation();
    }
    setTimeout(() => {
      // Needed to trigger change detection.
      this.props.service.selectedRouteStopId = undefined;
      this.props.service.selectedRouteStopId = route.expectedDelays[0].id;
    });
    */
  }
}
