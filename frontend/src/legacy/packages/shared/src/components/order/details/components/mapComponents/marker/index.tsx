import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import Localization from "shared/src/localization";
import { Marker, Popup } from "shared/src/components/worldMap";

export interface JourneyStopMarkerProps {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  stopNumber: number;
  // status: OrderStatus;
}

@observer
export class JourneyStopMarker extends Marker<JourneyStopMarkerProps> {
  protected popupGroup = "markers";

  protected renderMarker() {
    const position = this.props.position;
    const labelText = this.props.stopNumber.toString();

    return (
      <MarkerWithLabel
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          strokeWeight: 0,
          scale: 10,
          fillColor: "gray",
          fillOpacity: 1
        }}
        labelAnchor={new google.maps.Point(10, 10)}
        position={position}
        onMouseOver={this.showPopup}
        onMouseOut={this.hidePopup}
      >
        <div className="c-liveTracking-journeyStopMarker">
          <div>{labelText}</div>

          {/* {this.props.orderLocation.hasAlert && (
            <div className="c-liveTracking-routeStopMarker-alert" />
          )}

          {this.props.orderLocation.hasWarning && (
            <div className="c-liveTracking-routeStopMarker-warning" />
          )} */}
        </div>
      </MarkerWithLabel>
    );
  }

  protected renderPopup() {
    return (
      <Popup
        position={this.props.position}
        options={{
          disableAutoPan: true,
          pixelOffset: new google.maps.Size(0, -7)
        }}
        onMouseOver={this.showPopup}
        onMouseOut={this.hidePopup}
      >
        <div className="c-liveTracking-journeyStopMarker-popup">
          {this.renderStopInfo()}
        </div>
      </Popup>
    );
  }

  private renderStopInfo() {
    return (
      <React.Fragment>
        <div className="c-worldMap-popup-header">
          <div>
            {Localization.sharedValue(
              "RouteDetails_Map_RouteStopMarker_Heading",
              { stopNumber: this.props.stopNumber }
            )}
          </div>
        </div>

        {/* {this.props.orderLocation.outfit &&
          this.props.orderLocation.outfit.primaryName && (
            <div className="c-worldMap-popup-title">
              {this.props.orderLocation.outfit.primaryName}
            </div>
          )}

        {this.props.orderLocation.outfit &&
          this.props.orderLocation.outfit.secondaryName && (
            <div className="c-worldMap-popup-subtitle">
              {this.props.orderLocation.outfit.secondaryName}
            </div>
          )}

        <div className="c-worldMap-popup-section">
          <div>{this.props.orderLocation.location.address.primary}</div>
          <div>{this.props.orderLocation.location.address.secondary}</div>
        </div> */}

        <div className="c-worldMap-popup-section">
          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue(
                "RouteDetails_Map_RouteStopMarker_Status"
              )}
            </div>
            {/* <div
              className={`c-liveTracking-color-${
                this.props.orderLocation.status.accent
              }`}
            >
              {this.props.orderLocation.status.name}
            </div> */}
          </div>

          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue(
                "RouteDetails_Map_RouteStopMarker_ArrivalTimeFrame"
              )}
            </div>
            {/* <div>
              {Localization.formatTimeRange(
                this.props.orderLocation.arrivalTimeFrame
              )}
            </div> */}
          </div>

          {/* {this.props.orderLocation.arrivalTime && (
            <div className="c-worldMap-popup-section-row">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_Map_RouteStopMarker_ArrivalTime"
                )}
              </div>
              <div>
                {Localization.formatTime(this.props.orderLocation.arrivalTime)}
              </div>
            </div>
          )}

          {this.props.orderLocation.loadingTime && (
            <div className="c-worldMap-popup-section-row">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_Map_RouteStopMarker_LoadingTime"
                )}
              </div>
              <div>
                {Localization.formatDuration(
                  this.props.orderLocation.loadingTime
                )}
              </div>
            </div>
          )} */}
        </div>

        {/* {this.props.orderLocation.isDelayed && (
          <div className="c-worldMap-popup-section">
            <div className="c-worldMap-popup-section-row c-liveTracking-color-negative">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_Map_RouteStopMarker_Delayed"
                )}
              </div>
              {this.props.orderLocation.arrivalDelay && (
                <div>
                  {Localization.formatDuration(
                    this.props.orderLocation.arrivalDelay
                  )}
                </div>
              )}
            </div>
          </div>
        )} */}
      </React.Fragment>
    );
  }

  // private getIconOptions(): object {
  //   switch (this.props..status.slug) {
  //     // Use an opaque gray icon if the stop has not yet been visited.
  //     case "not-visited":
  //       return { fillColor: "gray", fillOpacity: 1 };

  //     // Use a transparent gray icon if the stop has been cancelled.
  //     case "cancelled":
  //       return { fillColor: "gray", fillOpacity: 0.5 };

  //     // Use a opaque green icon if the stop has been visited.
  //     case "arrived":
  //     case "completed":
  //     case "delivery-not-possible":
  //       return { fillColor: "#17C800", fillOpacity: 1 };

  //     // Use a opaque white icon if the stop has an unexpected status.
  //     default:
  //       return { fillColor: "white", fillOpacity: 1 };
  //   }
  // }
}
