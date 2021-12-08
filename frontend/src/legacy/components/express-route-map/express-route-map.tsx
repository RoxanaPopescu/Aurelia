import React from "react";
import { observer } from "mobx-react";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { DriverRoute, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";
import { DriverRouteLayer } from "./components/layers/driver-route-layer/driver-route-layer";
import { ExpressRoute } from "app/model/express-route";
import { ExpressRouteLayer } from "./components/layers/express-route-layer/express-route-layer";
import "./express-route-map.scss";
import { Container } from "aurelia-framework";
import { DriverRouteStopMarker } from "./components/features/driver-route-stop-marker/driver-route-stop-marker";
import { ExpressRouteStopMarker } from "./components/features/express-route-stop-marker/express-route-stop-marker";
import { DriverRouteSegmentLine } from "./components/features/driver-route-segment-line/driver-route-segment-line";
import { ExpressRouteDeliveryArrow } from "./components/features/express-route-delivery-arrow/express-route-delivery-arrow";
import { GoogleMap } from "react-google-maps";
import { Button, ButtonType } from "shared/src/webKit";
import { observable } from "mobx";
import { DriverMarker } from "./components/features/driver-marker/driver-marker";
import { DriverMarkerAvailable } from "./components/features/driver-marker-available/driver-marker-available";
import { Driver, DriverService } from "app/model/driver";
import { RouteAssignmentService } from "app/model/route";

export interface IExpressRouteMapProps
{
    isMerging: boolean;
    expressRoutes?: ExpressRoute[];
    driverRoutes?: DriverRoute[];
    newDriverStops?: (DriverRouteStop | ExpressRouteStop)[];
    remainingExpressStops?: ExpressRouteStop[][];
    onExpressRouteClick: (route: ExpressRoute) => void;
    onDriverRouteClick: (route: DriverRoute) => void;
    onConnectedStopClick: (stop: DriverRouteStop | ExpressRouteStop | null) => void;
    onUnconnectedStopClick: (stop: ExpressRouteStop) => void;
    onMapClick: () => void;
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

    @observable
    private isConnecting = false;

    @observable
    private isFetchingDriversNotOnRoute = false;

    @observable
    private availableDriversNotOnRoute: Driver[] | undefined;

    @observable
    private showAvailableDrivers = true;

    @observable
    private showAllDrivers = false;

    @observable
    private showAllRoutes = false;

    public render()
    {
        this.fitBoundsOnLoad();
        let selectedDriversCount = this.props.driverRoutes?.reduce((prev, current) => {
            if (current.selected) {
                return prev + 1;
            }

            return prev;
        }, 0) ?? 0;

        return (
            <div className="express-route-map">

                <div className="express-route-map-buttons">

                    <Button
                        className="express-route-map-fit-button"
                        type={ButtonType.Light}
                        onClick={() => this.tryFitBounds()}>
                        Zoom to fit
                    </Button>

                    {!this.props.isMerging && <Button
                        className={this.showAllRoutes ? "--active" : ""}
                        type={ButtonType.Light}
                        onClick={() => this.showAllRoutes = !this.showAllRoutes}>
                        Show all routes
                    </Button>}

                    {!this.props.isMerging && <Button
                        className={this.showAvailableDrivers ? "--active" : ""}
                        type={ButtonType.Light}
                        onClick={() => this.showAvailableDrivers = !this.showAvailableDrivers}>
                        Show available drivers
                    </Button>}

                    {!this.props.isMerging && <Button
                        className={this.showAllDrivers ? "--active" : ""}
                        type={ButtonType.Light}
                        onClick={() => this.showAllDrivers = !this.showAllDrivers}>
                        Show all drivers
                    </Button>}

                </div>

                <div className="express-route-map-buttons-bottom">

                    <Button
                        className="express-route-map-fit-button"
                        type={ButtonType.Light}
                        disabled={this.isFetchingDriversNotOnRoute}
                        onClick={() => this.fetchAvailableDriversNotOnRoute()}>

                            { this.availableDriversNotOnRoute == null ? "Show online ad-hoc drivers" : `Hide ${this.availableDriversNotOnRoute.length} drivers` }

                    </Button>

                </div>

                {this.isConnecting &&
                <div className="express-route-map-connect-info">
                    <div>
                        Choose the stop that should follow the stop you just clicked.
                    </div>

                    <Button className="express-route-map-cancel-connect" type={ButtonType.Action} onClick={() => this.onCancel()}>
                        Cancel
                    </Button>
                </div>}

                <WorldMap
                    options={{ scrollwheel: true }}
                    onClick={() =>this.onCancel()}
                    onMapReady={map =>
                    {
                        this.map = map;
                        this.fitBoundsOnLoad();
                    }}>

                    {!this.props.isMerging && this.props.driverRoutes && this.props.driverRoutes
                        .filter(route => {
                            if (route.selected || this.showAllDrivers) {
                                return true;
                            }

                            if (selectedDriversCount > 0) {
                                return false;
                            }

                            if (this.showAvailableDrivers && route.available) {
                                return true;
                            }

                            return false;
                        })
                        .map(route =>
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

                    {!this.props.isMerging && this.props.expressRoutes && this.props.expressRoutes
                        .filter(route => route.selected || this.showAllRoutes)
                        .map(route =>
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
                        ? <DriverRouteStopMarker key={`NewDriverRouteStop-${stop.id}`} routeStop={stop} onClick={() =>
                            { this.isConnecting = !this.isConnecting; this.props.onConnectedStopClick(stop); }}/>
                        : <ExpressRouteStopMarker key={`NewDriverRouteStop-${stop.id}`} routeStop={stop} onClick={() =>
                            { this.isConnecting = !this.isConnecting; this.props.onConnectedStopClick(stop); }}/>
                    )}

                    {this.props.isMerging && this.props.newDriverStops && this.props.newDriverStops.map((s, i, a) => i > 0 &&
                        <DriverRouteSegmentLine
                            key={`NewDriverRouteSegmentLine-${a[i - 1].id}-${s.id}`}
                            routeStops={[a[i - 1], s]}
                            onClick={() => { this.onCancel(); }}/>
                    )}

                    {this.props.isMerging && this.props.remainingExpressStops && this.props.remainingExpressStops.map(stops =>
                        stops.map(stop =>
                            <ExpressRouteStopMarker key={`RemainingExpressRouteStop-${stop.id}`} routeStop={stop} unconnected={true} onClick={() =>
                                { this.isConnecting = !this.isConnecting; this.props.onUnconnectedStopClick(stop); }}/>
                        )
                    )}

                    {this.props.isMerging && this.props.remainingExpressStops && this.props.remainingExpressStops.map(stops =>
                        stops.length > 1 && stops.map((s, i, a) => i > 0 &&
                            <ExpressRouteDeliveryArrow
                                key={`RemainingExpressRouteSegmentLine-${a[i - 1].id}-${s.id}`}
                                routeStops={[a[i - 1], s]}
                                onClick={() => { this.onCancel(); }}/>
                        )
                    )}

                    {!this.props.isMerging && this.availableDriversNotOnRoute != null && this.availableDriversNotOnRoute.map(d =>
                        <DriverMarkerAvailable
                            key={`DriverMarkerAvailable-${d.id}`}
                            driver={d}
                            faded={false}
                            onClick={(driver, type) => this.pushOrAssignToDriver(driver, type)}
                        />
                    )}

                    {this.props.isMerging && this.props.driverRoutes![0].driverPosition && this.props.newDriverStops &&
                        <DriverMarker
                            key={`DriverMarker-${this.props.driverRoutes![0].driver.id}`}
                            route={this.props.driverRoutes![0]}
                            faded={!this.props.driverRoutes![0].available}
                            onClick={() =>
                                { this.isConnecting = !this.isConnecting; this.props.onConnectedStopClick(null); }}
                        />}

                    {this.props.isMerging && this.props.driverRoutes![0].driverPosition && this.props.newDriverStops && this.props.newDriverStops[0] &&
                        <DriverRouteSegmentLine
                            key={`DriverRouteSegmentLine-driver-${this.props.newDriverStops[0].id}`}
                            routeStops={[this.props.driverRoutes![0].driverPosition!, this.props.newDriverStops[0]]}
                        />}

                </WorldMap>

            </div>
        );
    }

    private onCancel(): void
    {
        this.isConnecting = false;
        this.props.onMapClick();
    }

    private async fetchAvailableDriversNotOnRoute(): Promise<void>
    {
        if (this.map == null)
        {
            return;
        }

        if (this.availableDriversNotOnRoute != null)
        {
            this.availableDriversNotOnRoute = undefined;

            return;
        }

        this.isFetchingDriversNotOnRoute = true;

        try
        {
            const service = Container.instance.get(DriverService);
            this.availableDriversNotOnRoute = await service.onlineDrivers(this.map.getBounds().getNorthEast(), this.map.getBounds().getSouthWest());
        }
        catch
        {
            // Do nothing
        }
        finally
        {
            this.isFetchingDriversNotOnRoute = false;
        }
    }

    private async pushOrAssignToDriver(driver: Driver, type: "push" | "assign"): Promise<void>
    {
        const selectedRoutes = this.props.expressRoutes?.filter(r => r.selected);
        let selectedRoute: ExpressRoute | undefined;
        if (selectedRoutes != null)
        {
            if (selectedRoutes.length === 1)
            {
                selectedRoute = selectedRoutes[0];
            }
        }

        if (selectedRoute == null)
        {
            alert("This feature only works if one route is selected");
            return;
        }

        const confirmed = confirm(`Sure you want to ${type} to ${driver.name.toString()}`);
        if (!confirmed)
        {
            return;
        }

        try
        {
            const service = Container.instance.get(RouteAssignmentService);

            if (type === "assign")
            {
                await service.assignDriver(selectedRoute.id, driver);
            }
            else
            {
                await service.pushToDrivers(selectedRoute.id, [driver]);
            }
        }
        catch
        {
            // Do nothing
        }
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
