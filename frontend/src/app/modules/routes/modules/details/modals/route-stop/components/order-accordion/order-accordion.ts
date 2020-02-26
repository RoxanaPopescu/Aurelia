import { autoinject, bindable, computedFrom } from "aurelia-framework";
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
    protected model: Pickup | Delivery;

    /**
     * True if one or more colli has a negative status, otherwise false.
     */
    @computedFrom("model.colli.length")
    protected get hasProblems(): boolean
    {
        if (this.model instanceof Pickup)
        {
            return this.model.colli.some(c => c.status.accent.pickup === "negative");
        }

        if (this.model instanceof Delivery)
        {
            return this.model.colli.some(c => c.status.accent.delivery === "negative");
        }

        return false;
    }

    /**
     * Called when the header is clicked.
     * Toggles the component between its expanded and collapsed state.
     */
    protected onHeaderClick(event: MouseEvent): void
    {
        if (event.defaultPrevented || this.model.colli.length === 0)
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
        window.open(`/orders/details/${this.model.orderSlug}`, "_blank");
    }
}
