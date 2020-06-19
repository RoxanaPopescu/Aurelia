import { autoinject, noView, bindable } from "aurelia-framework";
import { Route, RouteStop, RouteService } from "app/model/route";
import { Wrapper } from "../../wrappers/wrapper";

// Import the component that should be wrapped.
import { RouteDetailsMapComponent as Component } from "./route-details-map";

@noView
@autoinject
export class RouteDetailsMap extends Wrapper
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
    public route: Route;

    @bindable
    public service: RouteService;

    @bindable
    public onRouteClick: undefined | ((context: { route: Route }) => void);

    @bindable
    public onStopClick: undefined | ((context: { route: Route; stop: RouteStop }) => void);

    @bindable
    public onMapClick: undefined | (() => void);

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component, {},
        {
            route: this.route,
            routeService: this.service,
            onRouteClick: (route) => this.onRouteClick?.({ route }),
            onStopClick: (route, stop) => this.onStopClick?.({ route, stop }),
            onMapClick: () => this.onMapClick?.()
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
