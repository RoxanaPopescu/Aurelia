import React from "react";
import { observer } from "mobx-react";
import { RouteStopMarker } from "../../features/route-stop-marker/route-stop-marker";
import { RouteSegmentLine } from "../../features/route-segment-line/route-segment-line";
import { DriverMarker } from "../../features/driver-marker/driver-marker";
import { Route, RouteStop } from "app/model/route";
import { Position } from "app/model/shared";
import { DriverPastMarker } from "../../features/driver-past-marker/driver-past-marker";

export interface RouteLayerProps
{
    route: Route;
    pastDriverPosition?: Position;
    onRouteClick?: (route: Route) => void;
    onStopClick?: (route: Route, stop: RouteStop) => void;
}

@observer
export class RouteLayer extends React.Component<RouteLayerProps> {

    public render()
    {
        return (
            <React.Fragment>

                {this.props.route.stops.length > 0 &&
                <>
                    {this.props.route.driverPosition &&
                        <RouteSegmentLine
                            key={`RouteSegmentLine-driver-${this.props.route.stops[0].id}`}
                            routeStops={[this.props.route.driverPosition!, this.props.route.stops[0]]}
                            onClick={() => this.props.onRouteClick?.(this.props.route)}
                        />}

                    {this.props.route.stops
                        .filter(s =>
                            s.status.slug !== "cancelled")
                        .map((s, i, a) => i > 0 &&
                            <RouteSegmentLine
                                key={`RouteSegmentLine-${a[i - 1].id}-${s.id}`}
                                routeStops={[a[i - 1], s]}
                                onClick={() => this.props.onRouteClick?.(this.props.route)}
                            />)}

                    {this.props.route.stops
                        .map(s => s instanceof RouteStop &&
                            <RouteStopMarker
                                key={`RouteStopMarker-${s.id}`}
                                routeStop={s}
                                onClick={() => this.props.onStopClick?.(this.props.route, s)}
                            />)}
                </>}

                {this.props.route.driverPosition &&
                    <DriverMarker
                        key={`DriverMarker-${this.props.route.driver?.id}`}
                        route={this.props.route}
                        onClick={() => this.props.onRouteClick?.(this.props.route)}
                    />}

                {this.props.pastDriverPosition &&
                    <DriverPastMarker
                        key={`DriverPastMarker`}
                        position={this.props.pastDriverPosition}
                    />}

            </React.Fragment>
        );
    }
}
