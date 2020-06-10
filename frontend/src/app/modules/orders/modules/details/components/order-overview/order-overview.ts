import { autoinject, bindable } from "aurelia-framework";
import { Order } from "app/model/order";

/**
 * Represents the module.
 */
@autoinject
export class OrderOverview
{
    /**
     * The order to present.
     */
    @bindable
    public order: Order | undefined;
}
