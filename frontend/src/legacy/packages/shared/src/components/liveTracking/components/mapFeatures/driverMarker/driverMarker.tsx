import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import Localization from "shared/src/localization";
import { Marker, Popup } from "shared/src/components/worldMap";
import "./driverMarker.scss";
import { Driver } from "app/model/driver";

export interface DriverMarkerProps {
  driver: Driver;
  faded: boolean;
  onClick?: (route: Driver) => void;
}

@observer
export class DriverMarker extends Marker<DriverMarkerProps> {
  protected popupGroup = "markers";

  protected renderMarker() {
    let labelText = this.props.driver.name.initials

    return (
      <MarkerWithLabel
        icon=" "
        labelAnchor={new google.maps.Point(17, 18)}
        position={this.props.driver.position!.toGoogleLatLng()}
        zIndex={500}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
        onClick={() => this.props.onClick && this.props.onClick(this.props.driver)}
      >
        <React.Fragment>

          <div className={"c-liveTracking-routeDriverMarker " + this.props.faded ? "--faded" : ""}>

            <div
              className={`
                c-liveTracking-routeDriverMarker-base
                c-liveTracking-routeDriverMarker-driver`}
            >
              {labelText}
            </div>

          </div>

        </React.Fragment>

      </MarkerWithLabel>
    );
  }

  protected renderPopup() {
    return (
      <Popup
        position={this.props.driver.position!.toGoogleLatLng()}
        options={{
          disableAutoPan: true,
          disableCloseButton: true,
          pixelOffset: new google.maps.Size(0, -11)
        }}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
      >

        <div className="c-liveTracking-routeDriverMarker-popup user-select-text">
          {this.renderDriverInfo()}
          {this.props.driver.onlineVehicle &&
            this.renderVehicleInfo()
          }
        </div>

      </Popup>
    );
  }


  private renderVehicleInfo() {

    return (
      <div className="c-worldMap-popup-section c-worldMap-popup-section--border">

        <div className="c-worldMap-popup-section-title">
          {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_Heading")}
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_Type")}</div>
          <div>{this.props.driver.onlineVehicle!.type.name}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_MakeAndModel")}</div>
          <div>{this.props.driver.onlineVehicle!.makeAndModel}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_Color")}</div>
          <div>{this.props.driver.onlineVehicle!.color}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_LicensePlate")}</div>
          <div>{this.props.driver.onlineVehicle!.licensePlate}</div>
        </div>

      </div>
    );
  }

  private renderDriverInfo() {

    return (
      <React.Fragment>

        <div className="c-worldMap-popup-header">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_Heading")}</div>
        </div>

        <div className="c-worldMap-popup-title">{this.props.driver!.name.toString()}</div>

        <div className="c-worldMap-popup-section">

          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverId")}</div>
            <div>{this.props.driver!.id.toString()}</div>
          </div>

          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_PhoneNumber")}</div>
            <a href={"tel:" + this.props.driver!.phone.toString()}>{this.props.driver!.phone.toString()}</a>
          </div>

          {this.props.driver.position && this.props.driver.position.timestamp &&
          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_PositionTimestamp")}</div>
            <div>{Localization.formatDateTime(this.props.driver.position.timestamp)}</div>
          </div>
        }

        </div>

      </React.Fragment>
    );
  }
}
