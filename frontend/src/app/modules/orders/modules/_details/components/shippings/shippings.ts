import { autoinject, bindable } from 'aurelia-framework';
import { OrderNew } from "app/model/order";

/**
 * Represents the module.
 */
@autoinject
export class Shippings
{
    /**
     * Creates a new instance of the class.
     */
    public constructor()
    {
    }

    /**
     * The order to present.
     */
    @bindable
    public order: OrderNew | undefined;

    /**
     * Current tab page the user is routed to.
     */
    protected tab: "actual" | "estimated" = "actual";
}
