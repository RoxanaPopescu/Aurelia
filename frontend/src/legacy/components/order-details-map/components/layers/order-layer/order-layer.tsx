import React from "react";
import { observer } from "mobx-react";
// import { RouteStopMarker } from "../../features/route-stop-marker/route-stop-marker";
// import { RouteSegmentLine } from "../../features/route-segment-line/route-segment-line";
// import { DriverMarker } from "../../features/driver-marker/driver-marker";
import { OrderNew } from "app/model/order";

export interface OrderLayerProps
{
    order: OrderNew
    onOrderClick?: (order: OrderNew) => void;
    onStopClick?: (order: OrderNew) => void;
}

@observer
export class OrderLayer extends React.Component<OrderLayerProps> {

    public render()
    {
        return (
            <React.Fragment>

                {/* {this.props.order.stops.length > 0 &&
                <>
                    {this.props.order.stops
                        .filter(s =>
                            s.status.slug !== "cancelled")
                        .map((s, i, a) => i > 0 &&
                            <RouteSegmentLine
                                key={`RouteSegmentLine-${a[i - 1].id}-${s.id}`}
                                routeStops={[a[i - 1], s]}
                                onClick={() => this.props.onOrderClick?.(this.props.order)}
                            />)}

                    <RouteStopMarker
                        key={`RouteStopMarker-${s.id}`}
                        routeStop={this.props.order.pickupLocation.position}
                        onClick={() => this.props.onStopClick?.(this.props.order, s)}
                    />)
                </>} */}

            </React.Fragment>
        );
    }
}
