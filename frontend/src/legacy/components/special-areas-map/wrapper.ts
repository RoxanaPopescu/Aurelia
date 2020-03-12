import { autoinject, noView, bindable } from "aurelia-framework";
import { Wrapper } from "../../wrappers/wrapper";
import { SpecialArea } from "app/model/_route-planning-settings";

// Import the component that should be wrapped.
import { SpecialAreasMapComponent as Component } from "./special-areas-map";

@noView
@autoinject
export class SpecialAreasMap extends Wrapper
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
    public areas: SpecialArea[];


    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component, {},
        {
            areas: this.areas
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
