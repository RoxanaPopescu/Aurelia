import React from "react";
import { observer } from "mobx-react";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { DriverRoute, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";
import { DriverRouteLayer } from "./components/layers/driver-route-layer/driver-route-layer";
import { ExpressRoute } from "app/model/express-route";
import { ExpressRouteLayer } from "./components/layers/express-route-layer/express-route-layer";
import "./express-route-map.scss";
import { DriverRouteStopMarker } from "./components/features/driver-route-stop-marker/driver-route-stop-marker";
import { ExpressRouteStopMarker } from "./components/features/express-route-stop-marker/express-route-stop-marker";
import { DriverRouteSegmentLine } from "./components/features/driver-route-segment-line/driver-route-segment-line";
import { ExpressRouteDeliveryArrow } from "./components/features/express-route-delivery-arrow/express-route-delivery-arrow";
import { GoogleMap } from "react-google-maps";
import { Button, ButtonType } from "shared/src/webKit";

export interface IExpressRouteMapProps
{
    isMerging: boolean;
    expressRoutes?: ExpressRoute[];
    driverRoutes?: DriverRoute[];
    newDriverStops?: (DriverRouteStop | ExpressRouteStop)[];
    remainingExpressStops?: ExpressRouteStop[][];
    onExpressRouteClick: (route: ExpressRoute) => void;
    onDriverRouteClick: (route: DriverRoute) => void;
}

/**
 * Represents a world map that shows express routes and driver routes.
 * In the `select` mode, the user may select routes or stops.
 * In the `connect` mode, the user may choose a stop on a driver route,
 * and connect it to other stops, thereby modifying the driver route.
 */
@observer
export class ExpressRouteMapComponent extends React.Component<IExpressRouteMapProps>
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
            <div className="express-route-map">

                <Button className="express-route-map-fit-button" type={ButtonType.Light} onClick={() => this.tryFitBounds()}>
                    Zoom to fit
                </Button>

                <WorldMap options={{ scrollwheel: true }} onMapReady={map =>
                    {
                        this.map = map;
                        this.fitBoundsOnLoad();
                    }}>

                    {!this.props.isMerging && this.props.driverRoutes && this.props.driverRoutes.map(route =>
                        <DriverRouteLayer
                            key={`DriverRouteLayer-${route.driver.id}-${route.selected}`}
                            route={route}
                            onClick={() =>
                            {
                                this.props.onDriverRouteClick(route);
                                this.forceUpdate();
                            }}
                        />
                    )}

                    {!this.props.isMerging && this.props.expressRoutes && this.props.expressRoutes.map(route =>
                        <ExpressRouteLayer
                            key={`ExpressRouteLayer-${route.id}-${route.selected}`}
                            route={route}
                            onClick={() =>
                            {
                                this.props.onExpressRouteClick(route);
                                this.forceUpdate();
                            }}
                        />
                    )}

                    {this.props.isMerging && this.props.newDriverStops && this.props.newDriverStops.map(stop =>
                        stop instanceof DriverRouteStop
                        ? <DriverRouteStopMarker key={`NewDriverRouteStop-${stop.id}`} routeStop={stop}/>
                        : <ExpressRouteStopMarker key={`NewDriverRouteStop-${stop.id}`} routeStop={stop}/>
                    )}

                    {this.props.isMerging && this.props.newDriverStops && this.props.newDriverStops.map((s, i, a) => i > 0 &&
                        <DriverRouteSegmentLine
                            key={`NewDriverRouteSegmentLine-${a[i - 1].id}-${s.id}`}
                            routeStops={[a[i - 1], s]}/>
                    )}

                    {this.props.isMerging && this.props.remainingExpressStops && this.props.remainingExpressStops.map(stops =>
                        stops.map(stop =>
                            <ExpressRouteStopMarker key={`RemainingExpressRouteStop-${stop.id}`} routeStop={stop} unconnected={true}/>
                        )
                    )}

                    {this.props.isMerging && this.props.remainingExpressStops && this.props.remainingExpressStops.map(stops =>
                        stops.length > 1 && stops.map((s, i, a) => i > 0 &&
                            <ExpressRouteDeliveryArrow
                                key={`RemainingExpressRouteSegmentLine-${a[i - 1].id}-${s.id}`}
                                routeStops={[a[i - 1], s]}/>
                        )
                    )}

                </WorldMap>

            </div>
        );
    }

    private fitBoundsOnLoad(): void
    {
        if (
            !this.hasFittedBounds &&
            this.map &&
            this.props.expressRoutes &&
            this.props.expressRoutes.length > 0 &&
            this.props.driverRoutes &&
            this.props.driverRoutes.length > 0)
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

        if (this.props.expressRoutes)
        {
            for (const route of this.props.expressRoutes)
            {
                for (const stop of route.stops)
                {
                    routeBounds.extend(stop.location.position!.toGoogleLatLng());
                }
            }
        }

        if (this.props.driverRoutes)
        {
            for (const route of this.props.driverRoutes)
            {
                for (const stop of route.stops)
                {
                    routeBounds.extend(stop.location.position!.toGoogleLatLng());
                }

                if (route.driverPosition)
                {
                    routeBounds.extend(route.driverPosition!.toGoogleLatLng());
                }
            }
        }

        if (this.props.newDriverStops)
        {
            for (const stop of this.props.newDriverStops)
            {
                routeBounds.extend(stop.location.position!.toGoogleLatLng());
            }
        }

        if (this.props.remainingExpressStops)
        {
            for (const stops of this.props.remainingExpressStops)
            {
                for (const stop of stops)
                {
                    routeBounds.extend(stop.location.position!.toGoogleLatLng());
                }
            }
        }

        (this.map.fitBounds as Function)(routeBounds, 50);
    }
}
