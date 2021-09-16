import { autoinject, noView, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Wrapper } from "../wrapper";

// Import the component that should be wrapped.
import Component from "fulfiller/src/components/routes/automaticDispatchDetails/index";
import { AutomaticDispatchService } from "app/model/automatic-dispatch";

@noView
@autoinject
export class AutomaticDispatchJobCustomElement extends Wrapper
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element, router: Router)
    {
        super(element);
    }

    @bindable
    public id: string;

    @bindable
    public service: AutomaticDispatchService;

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component,
        {
            id: this.id,
            automaticDispatchService: this.service
        });
    }
}
