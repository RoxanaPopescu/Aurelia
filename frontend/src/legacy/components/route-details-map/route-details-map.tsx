import React from "react";
import { observer } from "mobx-react";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { Route } from "app/model/route";
import { RouteLayer } from "./components/layers/route-layer/route-layer";
import "./route-details-map.scss";
import { GoogleMap } from "react-google-maps";
import { Button, ButtonType } from "shared/src/webKit";

export interface IRouteDetailsMapProps
{
    route?: Route;
    onRouteClick: (route: Route) => void;
    onMapClick: () => void;
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
            <div className="route-details-map">

                <div className="route-details-map-buttons">

                    <Button
                        className="route-details-map-fit-button"
                        type={ButtonType.Light}
                        onClick={() => this.tryFitBounds()}>
                        Zoom to fit
                    </Button>

                </div>

                <WorldMap
                    options={{ scrollwheel: true }}
                    onMapReady={map =>
                    {
                        this.map = map;
                        this.fitBoundsOnLoad();
                    }}>

                    {this.props.route != null &&
                    <RouteLayer
                        key={`RouteLayer-${this.props.route.driver?.id}`}
                        route={this.props.route}
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
