import React from "react";
import { observer } from "mobx-react";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { DriverRoute } from "app/model/express-route";
import { DriverRouteLayer } from "./components/layers/driver-route-layer/driver-route-layer";
import { ExpressRoute } from "app/model/express-route";
import { ExpressRouteLayer } from "./components/layers/express-route-layer/express-route-layer";
import "./express-route-map.scss";

export interface IExpressRouteMapProps
{
    expressRoutes?: ExpressRoute[];
    driverRoutes?: DriverRoute[];
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

    public render()
    {
        return (
            <div className="express-route-map">

                <WorldMap options={{ scrollwheel: true }}>

                    {this.props.driverRoutes && this.props.driverRoutes.map(route =>
                        <DriverRouteLayer
                            key={`DriverRouteLayer-${route.driver.id}-${route.selected}`}
                            route={route}
                            onClick={() =>
                            {
                                route.selected = !route.selected;
                                this.forceUpdate();
                            }}
                        />
                    )}

                    {this.props.expressRoutes && this.props.expressRoutes.map(route =>
                        <ExpressRouteLayer
                            key={`ExpressRouteLayer-${route.id}-${route.selected}`}
                            route={route}
                            onClick={() =>
                            {
                                route.selected = !route.selected;
                                this.forceUpdate();
                            }}
                        />
                    )}

                </WorldMap>

            </div>
        );
    }
}
