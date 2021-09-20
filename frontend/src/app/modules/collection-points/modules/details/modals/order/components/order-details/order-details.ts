import { autoinject, bindable } from "aurelia-framework";
import { Order } from "app/model/collection-point";

@autoinject
export class OrderDetailsCustomElement
{
    /**
     * The model for the modal.
     */
    @bindable
    public model: Order;
}
