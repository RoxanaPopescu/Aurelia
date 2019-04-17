import { autoinject, noView } from "aurelia-framework";
import { Wrapper } from "../wrapper";

// Import the component that should be wrapped.
import Component from "shared/src/components/activation/index";

@noView
@autoinject
export class ActivationCustomElement extends Wrapper
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        super(element);
    }

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component);
    }
}
