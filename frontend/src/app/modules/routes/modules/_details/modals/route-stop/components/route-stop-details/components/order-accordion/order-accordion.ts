import { autoinject, bindable } from "aurelia-framework";
import { Delivery } from "../../../../../../../../../../../legacy/packages/shared/src/model/logistics/delivery";
import { Pickup } from "../../../../../../../../../../../legacy/packages/shared/src/model/logistics/pickup";

@autoinject
export class OrderAccordionCustomElement
{
    /**
     * Creates a new instance of the class.
     */
    public constructor()
    {
        console.log(this.orders)
    }

    /**
     * The model for the modal.
     */
    @bindable
    protected expandedOrder: Delivery | Pickup | undefined;

    /**
     * The model for the modal.
     */
    @bindable
    protected orders: Delivery[] | Pickup[];

    /**
     * Called when the user changes the status of the stop.
     * Sets the new status.
     * @param status The new status value.
     */
    protected expanded(order: Delivery | Pickup): boolean
    {
        console.log("hej2", order.orderId)
        if (this.expandedOrder != null)
        {
            return order.orderId === this.expandedOrder.orderId;
        }

        return false;
    }

    /**
     * Called an order is clicked in the accordion.
     * Toggles the accordion.
     */
    protected onOrderClick(order: Delivery | Pickup): void
    {
        console.log("hej1", order.orderId)
        if (this.expandedOrder != null && order.orderId === this.expandedOrder.orderId)
        {
            this.expandedOrder = undefined;
        }
        else
        {
            this.expandedOrder = order;
        }
    }
}
