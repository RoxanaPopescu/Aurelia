import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Marker } from "shared/src/components/worldMap";
import { DriverRouteStop } from "app/model/express-route";
import "./express-route-stop-marker.scss";
import Localization from "shared/src/localization";

export interface ExpressRouteStopMarkerProps
{
    routeStop: DriverRouteStop;
    onClick?: () => void;
    faded?: boolean;
}

@observer
export class ExpressRouteStopMarker extends Marker<ExpressRouteStopMarkerProps>
{
    public constructor(props: ExpressRouteStopMarkerProps)
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
                labelAnchor={new google.maps.Point(27, 56)}
                position={position}
                zIndex={this.props.routeStop.selected ? 205 : 5}
                onMouseOver={() => this.showPopup()}
                onMouseOut={() => this.hidePopup()}
                onClick={() => this.props.onClick && this.props.onClick()}>

                <React.Fragment>
                    <div className={`expressRoutes-expressRouteStopMarker ${this.props.faded ? "--faded" : ""}`}>

                        <div className="expressRoutes-expressRouteStopMarker-info">
                            {Localization.formatTimeRange(this.props.routeStop.arrivalTimeFrame)}
                        </div>

                        <div className={`
                            expressRoutes-expressRouteStopMarker-shape
                            expressRoutes-expressRouteStopMarker--${this.getMarkerModifier()}
                            ${this.props.routeStop.selected ? "expressRoutes-expressRouteStopMarker--selected" : "" }`}>

                            <div>

                                {labelText}

                                {this.props.routeStop.hasAlert && (
                                    <div className="expressRoutes-expressRouteStopMarker-alert" />
                                    )}

                                {!this.props.routeStop.hasAlert && this.props.routeStop.hasWarning && (
                                    <div className="expressRoutes-expressRouteStopMarker-warning" />
                                    )}

                            </div>

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
