import { autoinject, noView, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Wrapper } from "../wrapper";
import { RouteService } from "app/model/route";

// Import the component that should be wrapped.
import Component from "shared/src/components/liveTracking/index";
import { CommunicationService } from "app/model/_communication";

@noView
@autoinject
export class LiveTrackingCustomElement extends Wrapper
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
        super.attached(Component, {},
        {
            routeService: this.service,
            communicationService: this.communication
        });
    }

    @bindable
    public service: RouteService;

    @bindable
    public communication: CommunicationService;
}
