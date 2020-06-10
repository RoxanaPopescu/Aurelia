import { autoinject, noView, bindable } from "aurelia-framework";
import { Order } from "app/model/order";
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
    public order: Order;

    @bindable
    public onMapClick: undefined | (() => void);

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component, {},
        {
            order: this.order,
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
