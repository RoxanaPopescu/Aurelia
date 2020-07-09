import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import Localization from "shared/src/localization";
import { Marker, Popup } from "shared/src/components/worldMap";
import "./routeDriverMarker.scss";
import { Position } from "app/model/shared";
import { RouteStop, RouteBase } from "app/model/route";

export interface RouteDriverMarkerProps {
  route: RouteBase;
  onClick?: (route: RouteBase) => void;
}

@observer
export class RouteDriverMarker extends Marker<RouteDriverMarkerProps> {

  protected popupGroup = "markers";

  protected get bestPosition(): Position {
    let position = this.props.route.driverPosition;

    if (position == null) {
      let stop = this.props.route.currentOrNextStop;
      if (stop != null) {
        position = stop.location.position;
      }
    }

    if (position == null) {
      position = this.props.route.stops[0].location.position;
    }

    return position!;
  }

  protected renderMarker() {
    let labelText = "";
    if (this.props.route.driver) {
      labelText = this.props.route.driver.name.initials
    } else if (this.props.route.owner) {
      labelText = this.props.route.owner.companyName?.substring(0,3) ?? "--";
    } else {
      labelText = this.props.route.fulfiller!.companyName!.substring(0, 2);
    }

    let additionalBaseClass = this.props.route.driver == null ? "noDriver" : "driver";

    return (
      <MarkerWithLabel
        icon=" "
        labelAnchor={new google.maps.Point(17, 18)}
        position={this.bestPosition.toGoogleLatLng()}
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
                c-liveTracking-routeDriverMarker-base
                c-liveTracking-routeDriverMarker-${additionalBaseClass}`}
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
        position={this.bestPosition.toGoogleLatLng()}
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
          {this.renderOwnerInfo()}
          {this.props.route.vehicle &&
          this.renderVehicleInfo()}
          {this.renderRouteInfo()}

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
            <a href={"tel:" + this.props.route.driver!.phone.toString()}>{this.props.route.driver!.phone.toString()}</a>
          </div>

          {!this.props.route.driverOnline &&
          <div className="c-worldMap-popup-section-row">
            <div/>
            <div className="routeDetails-color-negative">{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_DriverOffline")}</div>
          </div>
          }

        {this.props.route.driverPosition && this.props.route.driverPosition.timestamp &&
          <div className="c-worldMap-popup-section-row">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Driver_PositionTimestamp")}</div>
            <div>{Localization.formatDuration(this.props.route.driverPosition.timestamp.diffNow())}</div>
          </div>
        }
        </div>

      </React.Fragment>
    );
  }

  private renderOwnerInfo() {
    if (this.props.route.owner == null) {
      return undefined;
    }

    return (
      <div className="c-worldMap-popup-section c-worldMap-popup-section--border">
        <div className="c-worldMap-popup-header">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Owner_Heading")}</div>
        </div>

        <div className="c-worldMap-popup-title">{this.props.route.owner.companyName}</div>
      </div>
    );
  }

  private renderFulfillerInfo() {

    return (
      <React.Fragment>

        <div className="c-worldMap-popup-header">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_NoDriverAssigned")}</div>
        </div>

        <div className="c-worldMap-popup-header">
          <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Fulfiller_Heading")}</div>
        </div>

        <div className="c-worldMap-popup-title">{this.props.route.fulfiller.primaryName}</div>

        {this.props.route.fulfiller.secondaryName &&
        <div className="c-worldMap-popup-subtitle">{this.props.route.fulfiller.secondaryName}</div>}

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

  renderNoDriver(): JSX.Element | undefined {
    if (this.props.route.driver != null) {
      return;
    }

    let date = "";
    let stop = this.props.route.stops[0];
    if (stop instanceof RouteStop && stop.arrivalTimeFrame.from != null) {
      date = Localization.formatDateTime(stop.arrivalTimeFrame.from);
    }

    return (
      <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_StartDate")}
            </div>
            <div>{date}</div>
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

          {this.renderNoDriver()}

          {this.props.route.completedTime &&
          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_Done")}
            </div>
            <div>{Localization.formatTime(this.props.route.completedTime)}</div>
          </div>}

           <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue("Order_VehicleType")}
            </div>
            <div>{this.props.route.vehicleType.name}</div>
          </div>

          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue("Product_Type")}
            </div>
            <div>{this.props.route.productType.name}</div>
          </div>

          {this.props.route.completedTime == null && this.props.route.estimates?.completionTime &&
          <div className="c-worldMap-popup-section-row">
            <div>
              {Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_ExpectedDone")}
            </div>
            <div>{Localization.formatTime(this.props.route.estimates?.completionTime)}</div>
          </div>}
        </div>

        {this.props.route.expectedDelays != null && this.props.route.expectedDelays.length > 0 &&
        <div className="c-worldMap-popup-section">

          <div className="c-worldMap-popup-section-row routeDetails-color-negative">
            <div>{Localization.sharedValue("RouteDetails_Map_RouteDriverMarker_Route_ExpectedDelaysAtStop")}</div>
            <div>{Localization.formatIntegersAsRanges(this.props.route.expectedDelays.map(s => s.stopNumber), 3)}</div>
          </div>

        </div>}

      </React.Fragment>
    );
  }
}
