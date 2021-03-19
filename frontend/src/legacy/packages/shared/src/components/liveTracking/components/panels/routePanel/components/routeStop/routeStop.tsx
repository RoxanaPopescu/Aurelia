import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Session } from "shared/src/model/session";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { InputCheckbox } from "shared/src/webKit";
import { RouteStop, Route } from "app/model/route";
import { LiveTrackingService } from "shared/src/components/liveTracking/services/liveTrackingService";
import "./routeStop.scss";
import { SubPage } from "shared/src/utillity/page";

export interface RoutesLayerProps {
  route: Route;
  routeStop: RouteStop;
  service: LiveTrackingService;
  onClick: (routeStop: RouteStop) => void;
}

@observer
export class RouteStopComponent extends React.Component<RoutesLayerProps> {
  private onClick(): void {
    this.props.service.selectedRouteStopId = this.props.routeStop.id;
    this.props.onClick(this.props.routeStop);
  }

  private isFulfiller = Session.outfit instanceof Fulfiller;

  public render() {
    return (
      <div
        className="c-liveTracking-routePanel-routeStop"
        onClick={() => this.onClick()}
      >
        <div>
          <div className="c-liveTracking-routePanel-routeStop-stopNumber">
            {this.props.routeStop.stopNumber}
          </div>

          {this.isFulfiller &&
            this.props.routeStop.status.slug === "not-visited" &&
            this.props.routeStop.id && (
              <div className="c-liveTracking-routePanel-routeStop-stopCheckbox">
                <InputCheckbox
                  checked={this.props.routeStop.selected}
                  onChange={checked =>
                    (this.props.routeStop.selected = checked)
                  }
                />
              </div>
            )}
        </div>

        <div>
          <div className="c-liveTracking-panel-section user-select-text suppress-double-click">
            <div className="c-liveTracking-routePanel-routeStop-section">
              <div className="c-liveTracking-panel-title">
                {this.props.routeStop.outfit &&
                  this.props.routeStop.outfit.primaryName && (
                    <div>{this.props.routeStop.outfit.primaryName}</div>
                  )}

                {(!this.props.routeStop.outfit ||
                  !this.props.routeStop.outfit.primaryName) && (
                  <div className="c-liveTracking-routePanel-routeStop-unnamedStopTitle">
                    {Localization.sharedValue(
                      "LiveTracking_RouteStop_UnnamedStop"
                    )}
                  </div>
                )}

                <div
                  className={`c-liveTracking-color-${
                    this.props.routeStop.status.accent
                  }`}
                >
                  {this.props.routeStop.status.name}
                </div>
              </div>

              {this.props.routeStop.outfit &&
                this.props.routeStop.outfit.secondaryName && (
                  <div className="c-liveTracking-panel-subtitle">
                    {this.props.routeStop.outfit.secondaryName}
                  </div>
                )}
            </div>

            <div className="c-liveTracking-routePanel-routeStop-section">
              <div>{this.props.routeStop.location.address.primary}</div>
              <div>{this.props.routeStop.location.address.secondary}</div>
            </div>

            { this.props.routeStop.outfit &&
              <div className="c-liveTracking-panel-section-row">
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_Customer"
                  )}
                </div>
                <div>
                  {this.props.routeStop.outfit.personName}
                  {this.props.routeStop.outfit.contactPhone &&
                    <React.Fragment>
                      <span> (</span>
                      <a href={"tel:" + this.props.routeStop.outfit.contactPhone.toString()}>
                        {this.props.routeStop.outfit.contactPhone.toString()}
                      </a>
                      <span>)</span>
                    </React.Fragment>
                  }
                </div>
              </div>
            }

            <div className="c-liveTracking-panel-section-row">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_Map_RouteStopMarker_TimeFrame"
                )}
              </div>
              <div>
                {Localization.formatTimeRange(
                  this.props.routeStop.arrivalTimeFrame
                )}
              </div>
            </div>

            {this.props.routeStop.arrivedTime && (
              <div className="c-liveTracking-panel-section-row">
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_ArrivedTime"
                  )}
                </div>
                <div>
                  {Localization.formatTime(this.props.routeStop.arrivedTime)}
                </div>
              </div>
            )}

            {this.props.routeStop.arrivedTime == null && this.props.routeStop.estimates?.arrivalTime && (
              <div className="c-liveTracking-panel-section-row">
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_EstimatedArrivalTime"
                  )}
                </div>
                <div>
                  {Localization.formatTime(this.props.routeStop.estimates?.arrivalTime)}
                </div>
              </div>
            )}

            {this.props.routeStop.taskTime && (
              <div className="c-liveTracking-panel-section-row">
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_TaskTime"
                  )}
                </div>
                <div>
                  {Localization.formatDuration(
                    this.props.routeStop.taskTime
                  )}
                </div>
              </div>
            )}

            {this.props.routeStop.taskTime == null && this.props.routeStop.estimates?.taskTime && (
              <div className="c-liveTracking-panel-section-row">
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_EstimatedTaskTime"
                  )}
                </div>
                <div>
                  {Localization.formatDuration(
                    this.props.routeStop.estimates?.taskTime
                  )}
                </div>
              </div>
            )}

            {this.props.routeStop.waitingTime && (
              <div className="c-liveTracking-panel-section-row">
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_WaitingTime"
                  )}
                </div>
                <div>
                  {Localization.formatDuration(
                    this.props.routeStop.waitingTime
                  )}
                </div>
              </div>
            )}

            {this.props.routeStop.waitingTime == null && this.props.routeStop.estimates?.waitingTime && (
              <div className="c-liveTracking-panel-section-row">
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_EstimatedWaitingTime"
                  )}
                </div>
                <div>
                  {Localization.formatDuration(
                    this.props.routeStop.estimates?.waitingTime
                  )}
                </div>
              </div>
            )}

            {this.props.routeStop.authorityToLeave && (
              <div className="c-liveTracking-panel-section-row">
                <div>
                  Authority to leave
                </div>
                { this.props.routeStop.authorityToLeave.deliveryInstructions &&
                  <div>
                    {this.props.routeStop.authorityToLeave.deliveryInstructions}
                  </div>
                }
              </div>
            )}

            {this.props.routeStop.orderIds.length > 0 && (
              <div className="c-liveTracking-panel-section-row">
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_Orders"
                  )}
                </div>
                <div className="c-liveTracking-routePanel-routeStop-orderIds">
                    <div>
                      {this.props.routeStop.orderIds.map((orderId, i, a) => (
                        <div key={`route-stop-order-id-${orderId}`}>
                          <a href={SubPage.path(SubPage.OrderDetails).replace(":id", orderId)} target="_blank">
                            {orderId}
                          </a>
                          {i !== a.length - 1 ? ", " : ""}
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            )}
          </div>

          {this.props.routeStop.arrivedDelay && (
            <div
              className={`
              c-liveTracking-panel-message
              c-liveTracking-box-warning
            `}
            >
              <div>
                {Localization.sharedValue("RouteDetails_Map_RouteStopMarker_Delayed")}
              </div>
              <div>
                {Localization.formatDuration(
                  this.props.routeStop.arrivedDelay
                )}
              </div>
            </div>
          )}
          {this.props.routeStop.expectedArrivalDelay && (
            <div
              className={`
              c-liveTracking-panel-message
              c-liveTracking-box-negative
            `}
            >
              <div>
                {Localization.sharedValue("RouteDetails_Map_RouteStopMarker_ExpectedDelay")}
              </div>
              <div>
                {Localization.formatDuration(
                  this.props.routeStop.expectedArrivalDelay
                )}
              </div>
            </div>
          )}
          {this.props.routeStop.expectedTooEarly && (
            <div
              className={`
              c-liveTracking-panel-message
              c-liveTracking-box-neutral
            `}
            >
              <div>
                {Localization.sharedValue("RouteDetails_Map_RouteStopMarker_ExpectedTooEarly")}
              </div>
              <div>
                  {Localization.formatDuration(
                    this.props.routeStop.expectedTooEarly
                  )}
                </div>
            </div>
          )}
          {this.props.routeStop.arrivedTooEarly && (
            <div
              className={`
              c-liveTracking-panel-message
              c-liveTracking-box-neutral
            `}
            >
              <div>
                {Localization.sharedValue("RouteDetails_Map_RouteStopMarker_TooEarly")}
              </div>
              <div>
                  {Localization.formatDuration(
                    this.props.routeStop.arrivedTooEarly
                  )}
                </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
