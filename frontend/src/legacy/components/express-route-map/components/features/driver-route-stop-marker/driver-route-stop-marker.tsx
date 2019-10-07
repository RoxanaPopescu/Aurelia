import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Marker, Popup } from "shared/src/components/worldMap";
import { DriverRouteStop } from "app/model/express-route";
import "./driver-route-stop-marker.scss";
import Localization from "shared/src/localization";

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
        const labelText = `${(this.props.routeStop.newStopNumber || this.props.routeStop.stopNumber).toString()} ${this.props.routeStop.type.name[0]}`;

        return (
            <MarkerWithLabel
                icon=" "
                labelAnchor={new google.maps.Point(26, 51)}
                position={position}
                zIndex={this.props.routeStop.selected ? 103 : 3}
                onMouseOver={() => this.showPopup()}
                onMouseOut={() => this.hidePopup()}
                onClick={() => this.props.onClick && this.props.onClick()}>

                <React.Fragment>

                    <div className={`expressRoutes-driverRouteStopMarker ${this.props.faded ? "--faded" : ""}`}>

                        <div className={`
                            expressRoutes-driverRouteStopMarker-info
                            ${this.props.routeStop.hasAlert ? '--has-alert' : this.props.routeStop.hasWarning ? '--has-warning' : ''}`}>
                            <div>{Localization.formatTimeRange(this.props.routeStop.arrivalTimeFrame)}</div>
                            <div>Est. {Localization.formatTime(this.props.routeStop.arrivalTime) || "--:--"}</div>
                        </div>

                        <div className={`
                            expressRoutes-driverRouteStopMarker-shape
                            expressRoutes-driverRouteStopMarker--${this.getMarkerModifier()}
                            ${this.props.routeStop.selected ? "expressRoutes-driverRouteStopMarker--selected" : ""}`}>

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

    protected renderPopup()
    {
        if (this.props.faded)
        {
            return;
        }

        return (
            <Popup
                position={this.props.routeStop.location.position!.toGoogleLatLng()}
                options={{
                    disableAutoPan: true,
                    disableCloseButton: true,
                    pixelOffset: new google.maps.Size(-0.5, -8)
                }}
                onMouseOver={() => this.showPopup()}
                onMouseOut={() => this.hidePopup()}
                onCloseClick={() => this.hidePopup(0)}
            >
                <div className="user-select-text">
                    {this.renderStopInfo()}
                </div>
            </Popup>
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

    private renderStopInfo()
    {
        return (
            <React.Fragment>
                <div className="c-worldMap-popup-header">
                    <div>
                        {Localization.sharedValue(
                            "RouteDetails_Map_RouteStopMarker_Heading",
                            { stopNumber: this.props.routeStop.stopNumber }
                        )}
                    </div>
                </div>

                {this.props.routeStop.outfit &&
                    this.props.routeStop.outfit.primaryName && (
                        <div className="c-worldMap-popup-title">
                            {this.props.routeStop.outfit.primaryName}
                        </div>
                    )}

                {this.props.routeStop.outfit &&
                    this.props.routeStop.outfit.secondaryName && (
                        <div className="c-worldMap-popup-subtitle">
                            {this.props.routeStop.outfit.secondaryName}
                        </div>
                    )}

                <div className="c-worldMap-popup-section">
                    <div>{this.props.routeStop.location.address.primary}</div>
                    <div>{this.props.routeStop.location.address.secondary}</div>
                </div>

                <div className="c-worldMap-popup-section">
                    <div className="c-worldMap-popup-section-row">
                        <div>
                            {Localization.sharedValue(
                                "RouteDetails_Map_RouteStopMarker_Status"
                            )}
                        </div>
                        <div
                            className={`expressRoutes-color-${
                                this.props.routeStop.status.accent
                                }`}
                        >
                            {this.props.routeStop.status.name}
                        </div>
                    </div>

                    <div className="c-worldMap-popup-section-row">
                        <div>
                            {Localization.sharedValue(
                                "RouteDetails_Map_RouteStopMarker_ArrivalTimeFrame"
                            )}
                        </div>
                        <div>
                            {Localization.formatTimeRange(
                                this.props.routeStop.arrivalTimeFrame
                            )}
                        </div>
                    </div>

                    {this.props.routeStop.arrivalTime && (
                        <div className="c-worldMap-popup-section-row">
                            <div>
                                {Localization.sharedValue(
                                    "RouteDetails_Map_RouteStopMarker_ArrivalTime"
                                )}
                            </div>
                            <div>
                                {Localization.formatTime(this.props.routeStop.arrivalTime)}
                            </div>
                        </div>
                    )}

                    {this.props.routeStop.loadingTime && (
                        <div className="c-worldMap-popup-section-row">
                            <div>
                                {Localization.sharedValue(
                                    "RouteDetails_Map_RouteStopMarker_LoadingTime"
                                )}
                            </div>
                            <div>
                                {Localization.formatDuration(this.props.routeStop.loadingTime)}
                            </div>
                        </div>
                    )}

                    {this.props.routeStop.driverInstructions && (
                        <div className="c-worldMap-popup-section-row">
                            <div>
                                {Localization.sharedValue(
                                    "RouteDetails_Map_RouteStopMarker_DriverInstructions"
                                )}
                            </div>
                            <div>
                                {this.props.routeStop.driverInstructions}
                            </div>
                        </div>
                    )}
                </div>

                {this.props.routeStop.isDelayed && (
                    <div className="c-worldMap-popup-section c-worldMap-popup-section--noBorder">
                        <div className="c-worldMap-popup-section-row expressRoutes-color-negative">
                            <div>
                                {Localization.sharedValue(
                                    "RouteDetails_Map_RouteStopMarker_Delayed"
                                )}
                            </div>
                            {this.props.routeStop.arrivalDelay && (
                                <div>
                                    {Localization.formatDuration(
                                        this.props.routeStop.arrivalDelay
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
