import { autoinject, bindable } from 'aurelia-framework';
import { Order } from "app/model/order";

/**
 * Represents the module.
 */
@autoinject
export class Colli
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
    public order: Order | undefined;

    /**
     * Current tab page the user is routed to.
     */
    protected tab: "actual" | "estimated" = "actual";
}
