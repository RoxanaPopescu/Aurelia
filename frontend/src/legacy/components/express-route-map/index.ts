import { autoinject, noView, bindable } from "aurelia-framework";
import { Wrapper } from "../../wrappers/wrapper";

// Import the component that should be wrapped.
import { ExpressRouteMapComponent as Component } from "./express-route-map";
import { DriverRoute, ExpressRoute, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";

@noView
@autoinject
export class WorldMapCustomElement extends Wrapper
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
    public expressRoutes: ExpressRoute[];

    @bindable
    public driverRoutes: DriverRoute[];

    @bindable
    public newDriverStops: (DriverRouteStop | ExpressRouteStop)[];

    @bindable
    public remainingExpressStops?: ExpressRouteStop[][];

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component, {},
        {
            expressRoutes: this.expressRoutes,
            driverRoutes: this.driverRoutes,
            newDriverStops: this.newDriverStops,
            remainingExpressStops: this.remainingExpressStops
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
