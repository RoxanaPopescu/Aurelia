import { autoinject, noView, bindable } from "aurelia-framework";
import { Wrapper } from "../../wrappers/wrapper";

// Import the component that should be wrapped.
import { ExpressRouteMapComponent as Component } from "./express-route-map";
import { DriverRoute, ExpressRoute, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";

@noView
@autoinject
export class ExpressRouteMap extends Wrapper
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        super(element);
    }

    @bindable
    public isMerging: boolean;

    @bindable
    public expressRoutes: ExpressRoute[];

    @bindable
    public driverRoutes: DriverRoute[];

    @bindable
    public newDriverStops: (DriverRouteStop | ExpressRouteStop)[];

    @bindable
    public remainingExpressStops?: ExpressRouteStop[][];

    @bindable
    public onDriverRouteClick: (context: { route: DriverRoute }) => void;

    @bindable
    public onExpressRouteClick: (context: { route: DriverRoute }) => void;

    @bindable
    public onConnectedStopClick: (context: { stop: DriverRouteStop | ExpressRouteStop }) => void;

    @bindable
    public onUnconnectedStopClick: (context: { stop: ExpressRouteStop }) => void;

    @bindable
    public onMapClick: () => void;

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component, {},
        {
            isMerging: this.isMerging,
            expressRoutes: this.expressRoutes,
            driverRoutes: this.driverRoutes,
            newDriverStops: this.newDriverStops,
            remainingExpressStops: this.remainingExpressStops,
            onDriverRouteClick: route => this.onDriverRouteClick({ route }),
            onExpressRouteClick: route => this.onExpressRouteClick({ route }),
            onConnectedStopClick: stop => this.onConnectedStopClick({ stop }),
            onUnconnectedStopClick: stop => this.onUnconnectedStopClick({ stop }),
            onMapClick: () => this.onMapClick()

        });
    }

    /**
     * Called by the framework when a bindable property changes.
     */
    protected propertyChanged(): void
    {
        this.attached();
    }
}
