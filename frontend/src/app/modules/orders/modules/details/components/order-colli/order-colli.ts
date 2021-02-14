import { autoinject, bindable } from "aurelia-framework";
import { Order } from "app/model/order";

/**
 * Represents the module.
 */
@autoinject
export class OrderColli
{
    /**
     * Current tab page the user is routed to.
     */
    protected tab: "actual" | "estimated" = "actual";

    /**
     * The order to present.
     */
    @bindable
    public order: Order | undefined;
}
