import { autoinject, bindable } from "aurelia-framework";
import { Pickup, Delivery } from "app/model/route";

@autoinject
export class OrderAccordionCustomElement
{
    /**
     * The expanded pickup or delivery, if any.
     */
    protected expandedOrder: Delivery | Pickup | undefined;

    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable
    protected tableExpanded: boolean = false;

    /**
     * The pickups or deliveries to present.
     */
    @bindable
    protected orders: Delivery[] | Pickup[];

    /**
     * Called when the header is clicked.
     * Toggles the compoennt between its expanded and collapsed state.
     */
    protected onHeaderClick(event: MouseEvent, order: Delivery | Pickup): void
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
     * Called when an order is clicked in the accordion.
     * Expands and collapses the table.
     */
    protected onToggleTableClick(): void
    {
        this.tableExpanded = !this.tableExpanded;
    }

    /**
     * Called when the order slug is clicked in the accordion.
     * Prevents the event from propagating to the accordion head.
     * @param event The mouse event.
     * @param order The order whose slug was clicked.
     */
    protected onOrderSlugClick(order: Pickup | Delivery): void
    {
        window.open(`/orders/details/${order.orderSlug}`, "_blank");
    }
}
