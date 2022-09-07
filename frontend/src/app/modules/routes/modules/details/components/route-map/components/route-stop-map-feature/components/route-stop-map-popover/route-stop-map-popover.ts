import { autoinject, useShadowDOM, bindable } from "aurelia-framework";
import { RouteStop } from "app/model/route/entities/route-stop";

@autoinject
@useShadowDOM
export class RouteStopMapPopoverCustomElement
{
    /**
     * The element representing the component, and the content to be presented.
     */
    protected element: HTMLElement;

    /**
     * The route stop to present.
     */
     @bindable
    public routeStop: RouteStop;
}
