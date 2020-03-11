import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Marker, Popup } from "shared/src/components/worldMap";
import { Route } from "app/model/route";
import "./driver-marker.scss";
import Localization from "shared/src/localization";

export interface DriverMarkerProps {
  route: Route;
  onClick?: (route: Route) => void;
  faded?: boolean;
}

@observer
export class DriverMarker extends Marker<DriverMarkerProps> {

  protected popupGroup = "markers";

  protected renderMarker() {

    const position = this.props.route.driverPosition!.toGoogleLatLng();

    const labelText = this.props.route.driver?.name.initials;

    return (
      <MarkerWithLabel
        icon=" "
        labelAnchor={new google.maps.Point(26, 17)}
        position={position}
        zIndex={104}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
        onClick={() => this.props.onClick && this.props.onClick(this.props.route)}
      >

        <React.Fragment>

          <div className={`routeDetails-driverMarker ${this.props.faded ? "--faded" : ""}`}>

            <div
              className={`
                routeDetails-driverMarker-shape
                routeDetails-driverMarker--${this.getMarkerModifier()}`}
            >
              {labelText}

              {this.props.route.status.accent === "negative" &&
              <div className="routeDetails-driverMarker-alert"/>}

              {this.props.route.status.accent === "attention" &&
              <div className="routeDetails-driverMarker-warning"/>}

            </div>

          </div>

        </React.Fragment>

      </MarkerWithLabel>
    );
  }

  protected renderPopup() {
    return (
      <Popup
        position={this.props.route.driverPosition!.toGoogleLatLng()}
        options={{
          disableAutoPan: true,
          disableCloseButton: true,
          pixelOffset: new google.maps.Size(0, -18)
        }}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
      >

        <div className="routeDetails-routeDriverMarker-popup user-select-text">

          {this.renderDriverInfo()}

          {this.props.route.vehicle &&
          this.renderVehicleInfo()}

        </div>

      </Popup>
    );
  }

  private getMarkerModifier(): string {

    let modifierClass = "";

    modifierClass +=
      this.props.route.driverOnline ?
        " routeDetails-driverMarker--online" :
          " routeDetails-driverMarker--offline";

    return modifierClass;
  }

  private renderDriverInfo() {

    return (
      <React.Fragment>

        <div className="c-worldMap-popup-header">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_Heading")}</div>
        </div>

        <div className="c-worldMap-popup-title">{this.props.route.driver!.name.toString()}</div>

        <div className="c-worldMap-popup-section">

          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverId")}</div>
            <div>{this.props.route.driver!.id.toString()}</div>
          </div>

          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_PhoneNumber")}</div>
            <div>{this.props.route.driver!.phone.toString()}</div>
          </div>

        </div>

        {!this.props.route.driverOnline &&
        <div className="c-worldMap-popup-section">

          <div className="c-worldMap-popup-section-row routeDetails-color-negative">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverOffline")}</div>
          </div>

        </div>}

      </React.Fragment>
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
          <div>{this.props.route.vehicle!.type.name}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_MakeAndModel")}</div>
          <div>{this.props.route.vehicle!.makeAndModel}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_Color")}</div>
          <div>{this.props.route.vehicle!.color}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_LicensePlate")}</div>
          <div>{this.props.route.vehicle!.licensePlate}</div>
        </div>

      </div>
    );
  }
}
