import React from "react";
import { GoogleMap } from "react-google-maps";
import { observer } from "mobx-react";
import { Button, ButtonType } from "shared/src/webKit";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { Route, RouteStop } from "app/model/route";
import { RouteLayer } from "./components/layers/route-layer/route-layer";
import "./route-details-map.scss";
import { RouteService } from "app/model/route";
import Localization from "shared/src/localization";
import { observable } from "mobx";
import { RouteDriverPositionsService } from "shared/src/services/route-driver-positions-service";

export interface IRouteDetailsMapProps
{
    route?: Route;
    routeService: RouteService,
    onRouteClick: (route: Route) => void;
    onStopClick?: (route: Route, stop: RouteStop) => void;
    onMapClick?: () => void;
}

/**
 * Represents a world map that shows the route on a route details page.
 */
@observer
export class RouteDetailsMapComponent extends React.Component<IRouteDetailsMapProps>
{
    /**
     * Creates a new instance of the class.
     * @param props The props for the component.
     */
    public constructor(props: IRouteDetailsMapProps)
    {
        super(props);
    }

    @observable loadingDriverPositions = false;
    @observable failedDriverPositions = false;

    private map: GoogleMap | undefined;
    private hasFittedBounds = false;
    @observable private positionService?: RouteDriverPositionsService;

    private async fetchDriverRoute() {
        if (this.positionService) {
            this.positionService.status = this.positionService.status == "idle" ? "showing-all" : "idle";
            return;
        }

        this.loadingDriverPositions = true;
        this.failedDriverPositions = false;
        try {
            this.positionService = await this.props.routeService.getDriverPositions(this.props.route!);
        } catch {
            this.failedDriverPositions = true;
        } finally {
            this.loadingDriverPositions = false;
        }
    }

    private driverPositionButtonTitle(): string {
        if (this.loadingDriverPositions) {
            return "Loading...";
        }

        if (this.failedDriverPositions) {
            return "Failed...";
        }

        if (this.positionService) {
            if (!this.positionService.canPlay) {
                return "No driver data"
            }

            if (this.positionService.status == "playing") {
                return "Playing route, click to pause";
            } else if (this.positionService.status == "paused") {
                return "Playing route, click resume";
            } else if (this.positionService.status == "showing-all") {
                return "Hide driving route";
            }
        }

        return "Show driving route";
    }

    componentWillUnmount() {
        this.positionService?.reset();
    }

    public render()
    {
        this.fitBoundsOnLoad();

        return (
            <div className="routeDetails-map">

                <div className="routeDetails-map-buttons">

                    <Button
                        className="routeDetails-map-fit-button"
                        type={ButtonType.Light}
                        onClick={() => this.tryFitBounds()}>
                        {Localization.sharedValue("Map_ZoomToFit")}
                    </Button>

                    {this.props.route && ["in-progress", "completd"].includes(this.props.route!.status.slug) &&
                        <Button
                            className="routeDetails-map-fit-button"
                            type={ButtonType.Light}
                            onClick={() => this.fetchDriverRoute()}>
                                {this.driverPositionButtonTitle()}
                        </Button>
                    }
                </div>

                <WorldMap
                    options={{ scrollwheel: false }}
                    onClick={() =>this.props.onMapClick?.()}
                    onMapReady={map =>
                    {
                        this.map = map;
                        this.fitBoundsOnLoad();
                    }}>

                    {this.props.route != null &&
                    <RouteLayer
                        key={`RouteLayer-${this.props.route.driver?.id}`}
                        route={this.props.route}
                        allPastDriverPositions={this.positionService?.status == "showing-all" ? this.positionService?.positions : undefined}
                        onRouteClick={(route) => this.props.onRouteClick?.(route)}
                        onStopClick={(route, stop) => this.props.onStopClick?.(route, stop)}
                    />}

                </WorldMap>

            </div>
        );
    }

    private fitBoundsOnLoad(): void
    {
        if (
            !this.hasFittedBounds &&
            this.map &&
            this.props.route)
        {
            this.hasFittedBounds = true;
            this.tryFitBounds();
        }
    }

    panToCurrentPosition(): void
    {
        if (this.map == null || this.positionService == null)
        {
            return;
        }

        let currentPosition = this.positionService.currentPosition;
        if (this.positionService.status !== "playing" || currentPosition == null) {
            return;
        }

        this.map.panTo(currentPosition.toGoogleLatLng());
    }

    private tryFitBounds(): void
    {
        if (this.map == null)
        {
            return;
        }

        const routeBounds = new google.maps.LatLngBounds();

        if (this.props.route)
        {
            for (const stop of this.props.route.stops)
            {
                routeBounds.extend(stop.location.position!.toGoogleLatLng());
            }

            if (this.props.route.driverPosition)
            {
                routeBounds.extend(this.props.route.driverPosition!.toGoogleLatLng());
            }
        }

        (this.map.fitBounds as Function)(routeBounds, 50);
    }
}
