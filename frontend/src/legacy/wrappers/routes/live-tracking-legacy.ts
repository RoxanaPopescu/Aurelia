import { autoinject, noView } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Wrapper } from "../wrapper";

// Import the component that should be wrapped.
import Component from "shared/src/components/liveTracking-legacy/index";

@noView
@autoinject
export class LiveTrackingLegacyCustomElement extends Wrapper
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element, router: Router)
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
