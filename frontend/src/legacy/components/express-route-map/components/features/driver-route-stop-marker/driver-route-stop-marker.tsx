import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Marker } from "shared/src/components/worldMap";
import { DriverRouteStop } from "app/model/express-route";
import "./driver-route-stop-marker.scss";

export interface DriverRouteStopMarkerProps
{
    routeStop: DriverRouteStop;
    onClick?: () => void;
    faded?: boolean;
}

@observer
export class DriverRouteStopMarker extends Marker<DriverRouteStopMarkerProps>
{
    public constructor(props: DriverRouteStopMarkerProps)
    {
        super(props);
    }

    protected renderMarker()
    {
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
                onClick={() => this.props.onClick && this.props.onClick()}>

                <React.Fragment>
                    <div className={`expressRoutes-driverRouteStopMarker ${this.props.faded ? "--faded" : ""}`}>
                        <div className={`
                            expressRoutes-driverRouteStopMarker-shape
                            expressRoutes-driverRouteStopMarker--${this.getMarkerModifier()}
                            ${this.props.routeStop.selected ? "expressRoutes-driverRouteStopMarker--selected" : "" }`}>

                            {labelText}

                            {this.props.routeStop.hasAlert && (
                                <div className="expressRoutes-driverRouteStopMarker-alert" />
                            )}

                            {!this.props.routeStop.hasAlert && this.props.routeStop.hasWarning && (
                                <div className="expressRoutes-driverRouteStopMarker-warning" />
                            )}

                        </div>
                    </div>
                </React.Fragment>
            </MarkerWithLabel>
        );
    }

    private getMarkerModifier(): string
    {
        switch (this.props.routeStop.status.slug)
        {
            case "not-visited":
                return "pending";

            case "arrived":
                return "arrived";

            case "cancelled":
            case "cancelled-by-driver":
            case "cancelled-by-system":
            case "cancelled-by-user":
                return "cancelled";

            case "arrived":
            case "completed":
            case "delivery-not-possible":
                return "done";

            default:
                return "";
        }
    }
}
