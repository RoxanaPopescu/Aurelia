import { autoinject, noView, bindable } from "aurelia-framework";
import { Wrapper } from "../../wrappers/wrapper";

// Import the component that should be wrapped.
import { RouteDetailsMapComponent as Component } from "./route-details-map";
import { Route } from "app/model/route";

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
    public isMerging: boolean;

    @bindable
    public route: Route;

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component, {},
        {
            isMerging: this.isMerging,
            route: this.route
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
