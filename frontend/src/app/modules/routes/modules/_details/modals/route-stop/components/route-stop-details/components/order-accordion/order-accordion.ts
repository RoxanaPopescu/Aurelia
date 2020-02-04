import { autoinject, bindable } from "aurelia-framework";
import { Pickup, Delivery } from "app/model/route";

@autoinject
export class OrderAccordionCustomElement
{
    /**
     * True if the table is expanded, otherwise false.
     */
    @bindable
    protected tableExpanded: boolean = false;

    /**
     * The expanded pickup or delivery, if any.
     */
    @bindable
    protected expandedOrder: Delivery | Pickup | undefined;

    /**
     * The expanded pickups or deliveries to present.
     */
    @bindable
    protected orders: Delivery[] | Pickup[];

    /**
     * TODO: WTF IS THIS?
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
    protected onAccordionHeadClick(event: MouseEvent, order: Delivery | Pickup): void
    {
        if (event.defaultPrevented)
        {
            return;
        }

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
