import { autoinject, noView, bindable } from "aurelia-framework";
import { OrderNew } from "app/model/order";
import { Wrapper } from "../../wrappers/wrapper";

// Import the component that should be wrapped.
import { OrderDetailsMapComponent as Component } from "./order-details-map";

@noView
@autoinject
export class OrderDetailsMap extends Wrapper
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
    public order: OrderNew;

    @bindable
    public onOrderClick: undefined | ((context: { route: OrderNew }) => void);

    @bindable
    public onStopClick: undefined | ((context: { route: OrderNew; }) => void);

    @bindable
    public onMapClick: undefined | (() => void);

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component, {},
        {
            route: this.order,
            onRouteClick: (route) => this.onOrderClick?.({ route }),
            onStopClick: (route) => this.onStopClick?.({ route }),
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
