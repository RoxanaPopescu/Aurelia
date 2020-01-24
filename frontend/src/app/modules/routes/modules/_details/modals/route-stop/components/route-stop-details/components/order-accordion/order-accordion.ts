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
    protected tableExpanded: boolean = false;

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
     * Test
     * Test
     */
    protected expanded(order: Delivery | Pickup): boolean
    {
        if (this.expandedOrder != null)
        {
            return order.orderId === this.expandedOrder.orderId;
        }

        return false;
    }

    /**
     * Called when an accordion head is clicked.
     * Toggles the accordion.
     */
    protected onAccordionHeadClick(order: Delivery | Pickup): void
    {
        if (this.expandedOrder != null && order.orderId === this.expandedOrder.orderId)
        {
            this.tableExpanded = false;
            this.expandedOrder = undefined;
        }
        else
        {
            this.expandedOrder = order;
        }
    }

    /**
     * Called an order is clicked in the accordion.
     * Expands and collapses the table.
     */
    protected onToggleTableClick(): void
    {
        this.tableExpanded = !this.tableExpanded;
    }
}
