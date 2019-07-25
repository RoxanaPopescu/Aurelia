import React from "react";
import { observer } from "mobx-react";
import { DriverRouteStopMarker } from "../../features/driver-route-stop-marker/driver-route-stop-marker";
import { DriverRouteSegmentLine } from "../../features/driver-route-segment-line/driver-route-segment-line";
import { DriverMarker } from "../../features/driver-marker/driver-marker";
import { DriverRoute, DriverRouteStop } from "app/model/express-route";

export interface DriverRouteLayerProps
{
    route: DriverRoute
    onClick?: () => void;
}

@observer
export class DriverRouteLayer extends React.Component<DriverRouteLayerProps> {

    public render()
    {
        return (
            <React.Fragment>

                <DriverRouteSegmentLine
                    key={`DriverRouteSegmentLine-driver-${this.props.route.stops[0].id}`}
                    routeStops={[this.props.route.driverPosition!, this.props.route.stops[0]]}
                    onClick={() => this.onRouteClick()}
                    faded={!this.props.route.selected}
                />

                {this.props.route.stops
                    .filter(s =>
                        !s.status.slug.startsWith("cancelled"))
                    .map((s, i, a) => i > 0 &&
                        <DriverRouteSegmentLine
                            key={`DriverRouteSegmentLine-${a[i - 1].id}-${s.id}`}
                            routeStops={[a[i - 1], s]}
                            onClick={() => this.onRouteClick()}
                            faded={!this.props.route.selected}
                        />)}

                {this.props.route.stops
                    .map(s => s instanceof DriverRouteStop &&
                        <DriverRouteStopMarker
                            key={`DriverRouteStopMarker-${s.id}`}
                            routeStop={s}
                            onClick={() => this.onRouteClick()}
                            faded={!this.props.route.selected}
                        />)}

                {this.props.route.driverPosition &&
                    <DriverMarker
                        key={`DriverMarker-${this.props.route.driver.id}`}
                        route={this.props.route}
                        onClick={() => this.onRouteClick()}
                        faded={!this.props.route.selected}
                    />}

            </React.Fragment>
        );
    }

    private onRouteClick(): void
    {
        if (this.props.onClick != null)
        {
            this.props.onClick();
        }
    }
}
