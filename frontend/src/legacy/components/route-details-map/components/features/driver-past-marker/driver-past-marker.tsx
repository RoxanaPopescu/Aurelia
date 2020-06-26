import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Marker, Popup } from "shared/src/components/worldMap";
import "./driver-past-marker.scss";
import { Position } from "app/model/shared";
import Localization from "shared/src/localization";

export interface DriverPastMarkerProps {
  position: Position;
  showPopup: boolean;
}

@observer
export class DriverPastMarker extends Marker<DriverPastMarkerProps> {
  componentDidMount() {
    if (this.props.showPopup) {
      this.showPopup();
    }
  }

  protected renderMarker() {
    const position = this.props.position.toGoogleLatLng();

    return (
      <MarkerWithLabel
        icon=" "
        labelAnchor={new google.maps.Point(4, 4)}
        position={position}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
        zIndex={999}
      >
        <React.Fragment>

          <div className={`routeDetails-driverPastMarker`}>

            <div
              className={`
                routeDetails-driverPastMarker-shape`}
            >
            </div>

          </div>

        </React.Fragment>

      </MarkerWithLabel>
    );
  }

  protected renderPopup() {
    return (
      <Popup
        position={this.props.position.toGoogleLatLng()}
        options={{
          disableAutoPan: true,
          disableCloseButton: true,
          pixelOffset: new google.maps.Size(0, -9)
        }}
      >

        <div className="routeDetails-routeDriverMarker-popup user-select-text">
          {this.renderContent()}
        </div>

      </Popup>
    );
  }

  private renderContent() {

    return (
      <React.Fragment>

        <div className="c-worldMap-popup-header">
          <div>{Localization.sharedValue("Timestamp")}</div>
        </div>

        <div className="c-worldMap-popup-title">{this.props.position.timestamp.toFormat("MMM dd, HH:MM:ss")}</div>

      </React.Fragment>
    );
  }
}
