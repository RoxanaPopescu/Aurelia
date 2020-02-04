import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import Localization from "shared/src/localization";
import { RouteStop } from "shared/src/model/logistics/routes";
import { Marker, Popup } from "shared/src/components/worldMap";
import "./routeStopMarker.scss";

let lastSelectedRouteStopId: string;

export interface RouteStopMarkerProps {
  routeStop: RouteStop;
  selectedRouteStopId?: string;
  onClick?: (routeStop: RouteStop) => void;
}

@observer
export class RouteStopMarker extends Marker<RouteStopMarkerProps> {
  public constructor(props: RouteStopMarkerProps) {
    super(props);
  }

  protected popupGroup = "markers";

  public componentWillReceiveProps(nextProps: RouteStopMarkerProps) {
    if (
      lastSelectedRouteStopId !== nextProps.selectedRouteStopId &&
      nextProps.selectedRouteStopId === this.props.routeStop.id
    ) {
      lastSelectedRouteStopId = nextProps.selectedRouteStopId;
      this.showPopup();
    }
  }

  protected renderMarker() {
    const position = this.props.routeStop.location.position!.toGoogleLatLng();
    const labelText = this.props.routeStop.stopNumber.toString();

    return (
      <MarkerWithLabel
        icon=" "
        labelAnchor={new google.maps.Point(15, 15)}
        position={position}
        zIndex={this.props.routeStop.selected ? 3 : 2}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
        onClick={() => this.props.onClick && this.props.onClick(this.props.routeStop)}
      >
        <React.Fragment>
          <div className="c-liveTracking-routeStopMarker">
            <div
              className={`
                c-liveTracking-routeStopMarker-circle
                c-liveTracking-routeStopMarker--${this.getMarkerModifier()}
                ${
                  this.props.routeStop.selected
                    ? "c-liveTracking-routeStopMarker--selected"
                    : ""
                }`}
            >
              {labelText}

              {this.props.routeStop.hasAlert && (
                <div className="c-liveTracking-routeStopMarker-alert" />
              )}

              {!this.props.routeStop.hasAlert && this.props.routeStop.hasWarning && (
                <div className="c-liveTracking-routeStopMarker-warning" />
              )}
            </div>
          </div>
        </React.Fragment>
      </MarkerWithLabel>
    );
  }

  protected renderPopup() {
    return (
      <Popup
        position={this.props.routeStop.location.position!.toGoogleLatLng()}
        options={{
          disableAutoPan: true,
          disableCloseButton: true,
          pixelOffset: new google.maps.Size(-0.5, -8)
        }}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
        onCloseClick={() => this.onPopupCloseClick()}
      >
        <div className="c-liveTracking-routeStopMarker-popup user-select-text">
          {this.renderStopInfo()}
        </div>
      </Popup>
    );
  }

  private getMarkerModifier(): string {
    switch (this.props.routeStop.status.slug) {
      case "not-visited":
        return "pending";

      case "arrived":
        return "arrived";

      case "cancelled":
        return "cancelled";

      case "arrived":
      case "completed":
      case "delivery-not-possible":
        return "done";

      default:
        return "";
    }
  }

  private renderStopInfo() {
    return (
      <React.Fragment>
        <div className="c-worldMap-popup-header">
          <div>
            {Localization.sharedValue(
              "RouteDetails_Map_RouteStopMarker_Heading",
              { stopNumber: this.props.routeStop.stopNumber }
            )}
          </div>
        </div>

        {this.props.routeStop.outfit &&
          this.props.routeStop.outfit.primaryName && (
            <div className="c-worldMap-popup-title">
              {this.props.routeStop.outfit.primaryName}
            </div>
          )}

        {this.props.routeStop.outfit &&
          this.props.routeStop.outfit.secondaryName && (
            <div className="c-worldMap-popup-subtitle">
              {this.props.routeStop.outfit.secondaryName}
            </div>
          )}

        <div className="c-worldMap-popup-section">
          <div>{this.props.routeStop.location.address.primary}</div>
          <div>{this.props.routeStop.location.address.secondary}</div>
        </div>

        <div className="c-worldMap-popup-section">
          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue(
                "RouteDetails_Map_RouteStopMarker_Status"
              )}
            </div>
            <div
              className={`c-liveTracking-color-${
                this.props.routeStop.status.accent
              }`}
            >
              {this.props.routeStop.status.name}
            </div>
          </div>

          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue(
                "RouteDetails_Map_RouteStopMarker_ArrivalTimeFrame"
              )}
            </div>
            <div>
              {Localization.formatTimeRange(
                this.props.routeStop.arrivalTimeFrame
              )}
            </div>
          </div>

          {this.props.routeStop.arrivalTime && (
            <div className="c-worldMap-popup-section-row">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_Map_RouteStopMarker_ArrivalTime"
                )}
              </div>
              <div>
                {Localization.formatTime(this.props.routeStop.arrivalTime)}
              </div>
            </div>
          )}

          {this.props.routeStop.loadingTime && (
            <div className="c-worldMap-popup-section-row">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_Map_RouteStopMarker_LoadingTime"
                )}
              </div>
              <div>
                {Localization.formatDuration(this.props.routeStop.loadingTime)}
              </div>
            </div>
          )}

          {this.props.routeStop.driverInstructions && (
            <div className="c-worldMap-popup-section-row">
              <div>
                {Localization.sharedValue(
                    "RouteDetails_Map_RouteStopMarker_DriverInstructions"
                )}
              </div>
              <div>
                {this.props.routeStop.driverInstructions}
              </div>
            </div>
          )}
        </div>

        {this.props.routeStop.isDelayed && (
          <div className="c-worldMap-popup-section c-worldMap-popup-section--noBorder">
            <div className="c-worldMap-popup-section-row c-liveTracking-color-negative">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_Map_RouteStopMarker_Delayed"
                )}
              </div>
              {this.props.routeStop.arrivalDelay && (
                <div>
                  {Localization.formatDuration(
                    this.props.routeStop.arrivalDelay
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

  private onPopupCloseClick = () => {
    this.hidePopup(0);
    // tslint:disable-next-line:semicolon
  };
}
