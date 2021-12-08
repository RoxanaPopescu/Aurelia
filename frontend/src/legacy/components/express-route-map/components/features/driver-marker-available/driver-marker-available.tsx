import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Marker, Popup } from "shared/src/components/worldMap";
import "./driver-marker-available.scss";
import Localization from "shared/src/localization";
import { Driver } from "app/model/driver";

export interface DriverMarkerAvailableProps {
  driver: Driver;
  onClick: (driver: Driver, type: "push" | "assign") => void;
  faded?: boolean;
}

@observer
export class DriverMarkerAvailable extends Marker<DriverMarkerAvailableProps> {

  protected popupGroup = "markers";

  protected renderMarker() {
    const position = this.props.driver.position!.toGoogleLatLng();

    const labelText = (this.props.driver.name.toString()[0] ?? "").toUpperCase();

    return (
      <MarkerWithLabel
        icon=" "
        labelAnchor={new google.maps.Point(26, 17)}
        position={position}
        zIndex={12}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
      >

        <React.Fragment>

          <div className={`expressRoutes-driverMarkerAvailable ${this.props.faded ? "--faded" : ""}`}>

            <div
              className={`
                expressRoutes-driverMarkerAvailable-shape`}
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

        <div className="expressRoutes-routeDriverMarker-popup user-select-text">

          {this.renderDriverInfo()}

        </div>

      </Popup>
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
            <div>Assign to driver</div>
            <div>{<a onClick={() => this.props.onClick(this.props.driver, "assign")}>Assign</a>}</div>
          </div>

        <div className="c-worldMap-popup-section-row">
            <div>Push to driver</div>
            <div>{<a onClick={() => this.props.onClick(this.props.driver, "push")}>Push</a>}</div>
          </div>

          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverId")}</div>
            <div>{this.props.driver!.id.toString()}</div>
          </div>

          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_PhoneNumber")}</div>
            <a href={"tel:" + this.props.driver!.phone.toString()}>{this.props.driver!.phone.toString()}</a>
          </div>

        </div>

        {this.props.driver.onlineVehicle &&
        <div className="c-worldMap-popup-section">

          <div className="c-worldMap-popup-section-row">
            <div>Vehicle type</div>
            <div>{this.props.driver.onlineVehicle.type.name}</div>
          </div>

        </div>}

      </React.Fragment>
    );
  }
}
