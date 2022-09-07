import { autoinject, useShadowDOM, bindable } from "aurelia-framework";
import { OrderStop } from "app/model/order/entities/order-stop";

@autoinject
@useShadowDOM
export class OrderStopMapPopoverCustomElement
{
    /**
     * The element representing the component, and the content to be presented.
     */
    protected element: HTMLElement;

    /**
     * The order stop to present.
     */
     @bindable
    public orderStop: OrderStop;
}
