import React from "react";
import { observer } from "mobx-react";
import { Container } from "aurelia-framework";
import Localization from "shared/src/localization";
import { LiveTrackingService } from "../../../../../services/liveTrackingService";
import { routeFlagService } from "../../../../../services/routeFlagService";
import { Icon } from "shared/src/webKit";
import "./route.scss";
import { RouteInfo, RouteStopBase } from "app/model/route";
import { ModalService } from "shared/framework";
import { AddSupportNoteDialog } from "app/modules/routes/modules/details/modals/add-support-note/add-support-note";

export interface RoutesLayerProps {
  service: LiveTrackingService;
  route: RouteInfo;
}

@observer
export class RouteComponent extends React.Component<RoutesLayerProps, { supportNoteExpanded: boolean }> {

  public render() {
    const route = this.props.route;

    const driverOrFulfillerPhone = route.driver
      ? route.driver.phone.toString()
      : route.executor.contactPhone ? route.executor.contactPhone!.toString()
      : undefined;

    const isFlagged = routeFlagService.isFlagged(route.id);

    const accentClassName =
      route.criticality.slug == "high" ? "--negative" :
      route.criticality.slug == "medium" ? "--warning" :
      "--neutral";

    return (
      <div
        className={"c-liveTracking-routesPanel-route " + accentClassName}
        onClick={() => this.onClick()}
      >
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
              {this.props.service.summary(this.props.route)}
            </div>

            <div className="c-liveTracking-routesPanel-route-info">

            { route.driver &&
              <a href={"fleet-management/drivers/details/" + route.driver.id} target="_blank">{route.driver.name.toString()}</a>
            }

            { !route.driver &&
              <div>{route.executor.primaryName}</div>
            }

              {driverOrFulfillerPhone &&
              <a href={"tel:" + driverOrFulfillerPhone}>{driverOrFulfillerPhone}</a>}

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
          {this.renderSupportNote(route)}
        </div>

      </div>
    );
  }

  renderNoDriver(route: RouteInfo): JSX.Element | undefined {
    if (route.driver != null) {
      return;
    }

    let info = Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_NoneAssigned");
    let stop = route.stops[0];

    if (stop instanceof RouteStopBase && stop.arrivalTimeFrame.from != null) {
      info = info.replace("{time}", Localization.formatDateTime(stop.arrivalTimeFrame.from));
    } else {
      info = info.replace("{time}", "");
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

  renderSupportNote(route): JSX.Element | undefined {
    if (route.id !== this.props.service.selectedRoute?.id) {
      return;
    }

    const expanded = this.state?.supportNoteExpanded;
    const supportNote = this.props.service.selectedRoute!.supportNote;

    if (supportNote)
    {

      return (
        <div
          onClick={e => { if (!expanded) this.setState({ supportNoteExpanded: true }); }}
          className={`
            c-liveTracking-panel-message
            c-liveTracking-box-neutral
            ${!expanded ? "c-liveTracking-box-clickable" : ""}`}
          >
            <div style={{ flexGrow: 1 }}>
              <div
                onClick={e => { if (expanded) this.setState({ supportNoteExpanded: false }); }}
                className={expanded ? "c-liveTracking-box-clickable-header" : ""}>
                {Localization.sharedValue("LiveTracking_Route_SupportNote")}
              </div>
              {expanded &&
              <div>
                <p style={{ whiteSpace: "pre-line" }}>{supportNote}</p>
                <a onClick={e => this.onAddSupportNoteClick(e, route)}>
                  {Localization.sharedValue("LiveTracking_Route_AddSupportNote")}
                </a>
              </div>}
            </div>
        </div>
      );
    }
    else
    {
      return (
        <div
          className={`
            c-liveTracking-panel-message`}
          style={{ paddingLeft: 0 }}
          >
            <a onClick={e => this.onAddSupportNoteClick(e, route)}>
              {Localization.sharedValue("LiveTracking_Route_AddSupportNote")}
            </a>
        </div>
      );
    }
  }

  protected async onAddSupportNoteClick(event, route): Promise<void>
  {
      // Just to be sure we have no inconsistent state here...
      if (route.id !== this.props.service.selectedRoute?.id) {
        return;
      }

      event.stopPropagation();

      const added = await Container.instance.get(ModalService).open(AddSupportNoteDialog, { route: this.props.service.selectedRoute! }).promise;

      if (!added)
      {
          return;
      }

      this.setState({ supportNoteExpanded: true });

      this.props.service.pollDetails()
  }

  private onClick(): void {
    const route = this.props.route;

    if (this.props.service.selectedRouteSlug !== this.props.route.slug) {
      this.props.service.setSelectedRouteSlug(this.props.route.slug);
      this.props.service.selectedRouteStopId = route.currentOrNextStop ?
      route.currentOrNextStop.id : undefined;

      history.pushState({ ...history.state, state: { routeId: route.slug }}, "", window.location.href);
    } else {
      // Go back?
    }
  }

  private onFlagClick(event: React.MouseEvent): void {
    routeFlagService.toggleFlag(this.props.route.id);
    this.forceUpdate();
    this.props.service.triggerRoutesChanged();
    event.stopPropagation();
  }

  private onDelayMessageClicked(event: React.MouseEvent): void {
    if (this.props.service.selectedRouteSlug === this.props.route.slug) {
      event.stopPropagation();
    }
    setTimeout(() => {
      // Needed to trigger change detection.
      this.props.service.selectedRouteStopId = undefined;
      this.props.service.selectedRouteStopId = this.props.route.expectedDelays[0].id;
    });
  }
}
