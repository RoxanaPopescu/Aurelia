import React from "react";
import { GoogleMap } from "react-google-maps";
import { observer } from "mobx-react";
import { Button, ButtonType } from "shared/src/webKit";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { Route, RouteStop } from "app/model/route";
import { RouteLayer } from "./components/layers/route-layer/route-layer";
import "./route-details-map.scss";

export interface IRouteDetailsMapProps
{
    route?: Route;
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
    public constructor(props: any)
    {
        super(props);
    }

    private map: GoogleMap | undefined;
    private hasFittedBounds = false;

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
                        Zoom to fit
                    </Button>

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
