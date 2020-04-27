import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import Localization from "shared/src/localization";
import { Route } from "shared/src/model/logistics/routes";
import { Marker, Popup } from "shared/src/components/worldMap";
import "./routeDriverMarker.scss";

export interface RouteDriverMarkerProps {
  route: Route;
  onClick?: (route: Route) => void;
}

@observer
export class RouteDriverMarker extends Marker<RouteDriverMarkerProps> {

  protected popupGroup = "markers";

  protected renderMarker() {

    const position = this.props.route.driverPosition!.toGoogleLatLng();

    const labelText = this.props.route.driver
      ? this.props.route.driver.name.initials
      : this.props.route.fulfiller!.companyName!.substring(0, 2);

    return (
      <MarkerWithLabel
        icon=" "
        labelAnchor={new google.maps.Point(17, 18)}
        position={position}
        zIndex={100 + (["completed", "cancelled"].includes(this.props.route.status.slug)
          ? -1
          : this.props.route.criticality.rank)}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
        onClick={() => this.props.onClick && this.props.onClick(this.props.route)}
      >

        <React.Fragment>

          <div className="c-liveTracking-routeDriverMarker">

            <div
              className={`
                c-liveTracking-routeDriverMarker-circle
                c-liveTracking-routeDriverMarker--${this.getMarkerModifier()}`}
            >
              {labelText}

              {this.props.route.criticality.slug === "high" &&
              <div className="c-liveTracking-routeDriverMarker-alert"/>}

              {this.props.route.criticality.slug === "medium" &&
              <div className="c-liveTracking-routeDriverMarker-warning"/>}

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
          pixelOffset: new google.maps.Size(0, -11)
        }}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
      >

        <div className="c-liveTracking-routeDriverMarker-popup user-select-text">

          {this.props.route.driver ?
          this.renderDriverInfo() :
          this.renderFulfillerInfo()}

          {this.props.route.driverVehicle &&
          this.renderVehicleInfo()}

          {this.renderRouteInfo()}

        </div>

      </Popup>
    );
  }

  private getMarkerModifier(): string {

    let modifierClass = "";

    modifierClass +=
      this.props.route.driverOnline ?
        " c-liveTracking-routeDriverMarker--online" :
          " c-liveTracking-routeDriverMarker--offline";

    modifierClass +=
      this.props.route.status.slug === "completed" ?
        " c-liveTracking-routeDriverMarker--completed" :
          this.props.route.status.slug === "cancelled" ?
            " c-liveTracking-routeDriverMarker--cancelled" :
              "";

    return modifierClass;
  }

  private renderDriverInfo() {

    return (
      <React.Fragment>

        <div className="c-worldMap-popup-header">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_Heading")}</div>
        </div>

        <div className="c-worldMap-popup-title">{this.props.route.driver!.name.toString()}</div>

        {this.props.route.fulfiller.companyName &&
        <div className="c-worldMap-popup-subtitle">{this.props.route.fulfiller.primaryName}</div>}

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

          <div className="c-worldMap-popup-section-row c-routeDetails-color-negative">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverOffline")}</div>
          </div>

        </div>}

      </React.Fragment>
    );
  }

  private renderFulfillerInfo() {

    return (
      <React.Fragment>

        <div className="c-worldMap-popup-header">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Fulfiller_Heading")}</div>
        </div>

        <div className="c-worldMap-popup-title">{this.props.route.fulfiller.primaryName}</div>

        {this.props.route.fulfiller.secondaryName &&
        <div className="c-worldMap-popup-subtitle">{this.props.route.fulfiller.secondaryName}</div>}

        <div className="c-worldMap-popup-section">

          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Fulfiller_FulfillerID")}</div>
            <div>{this.props.route.fulfiller.id}</div>
          </div>

          {this.props.route.fulfiller.contactPhone &&
          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Fulfiller_PhoneNumber")}</div>
            <div>{this.props.route.fulfiller.contactPhone.toString()}</div>
          </div>}

        </div>

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
          <div>{this.props.route.driverVehicle!.vehicleType.name}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_MakeAndModel")}</div>
          <div>{this.props.route.driverVehicle!.makeAndModel}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_Color")}</div>
          <div>{this.props.route.driverVehicle!.color}</div>
        </div>

        <div className="c-worldMap-popup-section-row">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Vehicle_LicensePlate")}</div>
          <div>{this.props.route.driverVehicle!.licensePlate}</div>
        </div>

      </div>
    );
  }

  private renderRouteInfo() {

    return (
      <React.Fragment>

        <div className="c-worldMap-popup-section c-worldMap-popup-section--border">

          <div className="c-worldMap-popup-section-title">
            {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_Heading")}
          </div>

          <div className={`c-worldMap-popup-section-row c-liveTracking-color-${this.props.route.status.accent}`}>
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_Status")}</div>
            <div>{this.props.route.status.name}</div>
          </div>

          {this.props.route.completedTime &&
          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_Done")}
            </div>
            <div>{Localization.formatTime(this.props.route.completedTime)}</div>
          </div>}

          {this.props.route.completedTime == null && this.props.route.estimates?.completionTime &&
          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_ExpectedDone")}
            </div>
            <div>{Localization.formatTime(this.props.route.estimates?.completionTime)}</div>
          </div>}
        </div>

        {this.props.route.expectedDelays.length > 0 &&
        <div className="c-worldMap-popup-section">

          <div className="c-worldMap-popup-section-row c-routeDetails-color-negative">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_ExpectedDelaysAtStop")}</div>
            <div>{Localization.formatIntegersAsRanges(this.props.route.expectedDelays.map(s => s.stopNumber), 3)}</div>
          </div>

        </div>}

      </React.Fragment>
    );
  }
}
