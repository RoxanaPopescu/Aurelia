import { autoinject, bindable } from "aurelia-framework";
import { Order } from "app/model/collection-point";

@autoinject
export class ColliAccordionCustomElement
{
    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable
    public expanded: boolean = false;

    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable
    public showAllColli: boolean = false;

    /**
     * The pickups or deliveries to present.
     */
    @bindable
    public model: Order;

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
}
