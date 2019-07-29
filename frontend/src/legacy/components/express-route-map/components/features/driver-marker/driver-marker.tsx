import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Marker } from "shared/src/components/worldMap";
import { DriverRoute } from "app/model/express-route";
import "./driver-marker.scss";

export interface DriverMarkerProps {
  route: DriverRoute;
  onClick?: (route: DriverRoute) => void;
  faded?: boolean;
}

@observer
export class DriverMarker extends Marker<DriverMarkerProps> {

  protected popupGroup = "markers";

  protected renderMarker() {

    const position = this.props.route.driverPosition!.toGoogleLatLng();

    const labelText = this.props.route.driver.name.initials;

    return (
      <MarkerWithLabel
        icon=" "
        labelAnchor={new google.maps.Point(26, 17)}
        position={position}
        zIndex={100}
        onMouseOver={() => this.showPopup()}
        onMouseOut={() => this.hidePopup()}
        onClick={() => this.props.onClick && this.props.onClick(this.props.route)}
      >

        <React.Fragment>

          <div className={`expressRoutes-driverMarker ${this.props.faded ? "--faded" : ""}`}>

            <div
              className={`
                expressRoutes-driverMarker-shape
                expressRoutes-driverMarker--${this.getMarkerModifier()}`}
            >
              {labelText}

              {this.props.route.status.accent === "negative" &&
              <div className="expressRoutes-driverMarker-alert"/>}

              {this.props.route.status.accent === "attention" &&
              <div className="expressRoutes-driverMarker-warning"/>}

            </div>

          </div>

        </React.Fragment>

      </MarkerWithLabel>
    );
  }

  private getMarkerModifier(): string {

    let modifierClass = "";

    modifierClass +=
      this.props.route.driverOnline ?
        " expressRoutes-driverMarker--online" :
          " expressRoutes-driverMarker--offline";

    return modifierClass;
  }
}
