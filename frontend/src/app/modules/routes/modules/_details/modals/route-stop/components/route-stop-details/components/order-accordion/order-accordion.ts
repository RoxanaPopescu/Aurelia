import { autoinject, bindable } from "aurelia-framework";
import { Pickup, Delivery } from "app/model/route";

@autoinject
export class OrderAccordionCustomElement
{
    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable
    protected expanded: boolean = false;

    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable
    protected showAllColli: boolean = false;

    /**
     * The pickups or deliveries to present.
     */
    @bindable
    protected order: Delivery | Pickup;

    /**
     * Called when the header is clicked.
     * Toggles the component between its expanded and collapsed state.
     */
    protected onHeaderClick(event: MouseEvent): void
    {
        if (event.defaultPrevented)
        {
            return;
        }

        this.expanded = !this.expanded;
    }

    /**
     * Called when the 'Show all' or 'Show less' button is clicked.
     * Toggles between showing some or all colli.
     */
    protected onShowAllColliToggle(event: MouseEvent): void
    {
        this.showAllColli = !this.showAllColli;
    }

    /**
     * Called when the order slug is clicked in the accordion.
     * Opens the order in a new window.
     */
    protected onOrderSlugClick(): void
    {
        window.open(`/orders/details/${this.order.orderSlug}`, "_blank");
    }
}
