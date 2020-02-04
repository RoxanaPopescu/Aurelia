import React from "react";
import { observer } from "mobx-react";
import { ExpressRouteStopMarker } from "../../features/express-route-stop-marker/express-route-stop-marker";
import { ExpressRouteDeliveryArrow } from "../../features/express-route-delivery-arrow/express-route-delivery-arrow";
import { ExpressRoute, ExpressRouteStop } from "app/model/express-route";

export interface ExpressRouteLayerProps
{
    route: ExpressRoute
    onClick?: () => void;
}

@observer
export class ExpressRouteLayer extends React.Component<ExpressRouteLayerProps> {

    public render()
    {
        return (
            <React.Fragment>

                {this.props.route.stops
                    .filter(s =>
                        s.status.slug !== "cancelled")
                    .map((s, i, a) => i > 0 &&
                        <ExpressRouteDeliveryArrow
                            key={`ExpressRouteDeliveryArrow-${a[i - 1].id}-${s.id}`}
                            routeStops={[a[i - 1], s]}
                            onClick={() => this.onRouteClick()}
                            faded={!this.props.route.selected}
                        />)}

                {this.props.route.stops
                    .map(s => s instanceof ExpressRouteStop &&
                        <ExpressRouteStopMarker
                            key={`ExpressRouteStopMarker-${s.id}`}
                            routeStop={s}
                            onClick={() => this.onRouteClick()}
                            faded={!this.props.route.selected}
                        />)}

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
