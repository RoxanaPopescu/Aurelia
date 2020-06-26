import React from "react";
import { observer } from "mobx-react";
import { RouteStopMarker } from "../../features/route-stop-marker/route-stop-marker";
import { RouteSegmentLine } from "../../features/route-segment-line/route-segment-line";
import { DriverMarker } from "../../features/driver-marker/driver-marker";
import { Route, RouteStop } from "app/model/route";
import { Position } from "app/model/shared";
import { DriverPastMarker } from "../../features/driver-past-marker/driver-past-marker";
import { DriverSegmentLine } from "../../features/driver-segment-line/driver-segment-line";

export interface RouteLayerProps
{
    route: Route;
    pastDriverPosition?: Position;
    allPastDriverPositions?: Position[];
    onRouteClick?: (route: Route) => void;
    onStopClick?: (route: Route, stop: RouteStop) => void;
}

@observer
export class RouteLayer extends React.Component<RouteLayerProps> {

    public renderPastPositions(): undefined | JSX.Element[] {
        let positions = this.props.allPastDriverPositions;

        if (positions == null) {
            return undefined;
        }

        let length = positions.length;
        let components: JSX.Element[] = positions.map((p, i) => {
            const showPopup = (i == 0 || i == length-1)
            return (<DriverPastMarker
                    key={`DriverPastMarker` + p.latitude.toString + p.longitude.toString()}
                    position={p}
                    showPopup={showPopup}
                />);
        });

        if (length > 1) {
            components.push(
                <DriverSegmentLine
                    key={`DriverSegmentLine`}
                    positions={positions}
                    faded={false}
                />
            );
        }

        return components;
    }

    public render()
    {
        let showingPastPositions = this.props.allPastDriverPositions ? true : false;

        return (
            <React.Fragment>

                {this.props.route.stops.length > 0 &&
                <>
                    {this.props.route.driverPosition &&
                        <RouteSegmentLine
                            key={`RouteSegmentLine-driver-${this.props.route.stops[0].id}`}
                            routeStops={[this.props.route.driverPosition!, this.props.route.stops[0]]}
                            faded={showingPastPositions}
                            onClick={() => this.props.onRouteClick?.(this.props.route)}
                        />}

                    {!showingPastPositions && this.props.route.stops
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
                                faded={showingPastPositions}
                                onClick={() => this.props.onStopClick?.(this.props.route, s)}
                            />)}
                </>}

                {this.props.route.driverPosition &&
                    <DriverMarker
                        key={`DriverMarker-${this.props.route.driver?.id}`}
                        route={this.props.route}
                        faded={showingPastPositions}
                        onClick={() => this.props.onRouteClick?.(this.props.route)}
                    />}

                {this.renderPastPositions()}

            </React.Fragment>
        );
    }
}
