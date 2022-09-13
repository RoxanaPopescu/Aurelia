import { Driver } from "app/model/driver";
import { autoinject, useShadowDOM, bindable } from "aurelia-framework";

@autoinject
@useShadowDOM
export class RouteDriverMapPopoverCustomElement
{
    /**
     * The element representing the component, and the content to be presented.
     */
    protected element: HTMLElement;

    /**
     * The driver to present.
     */
     @bindable
    public driver: Driver;
}
