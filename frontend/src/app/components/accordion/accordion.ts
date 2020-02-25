import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class AccordionCustomElement
{
    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable
    protected expanded: boolean = false;

    /**
     * True if the component can be expanded, otherwise false.
     */
    @bindable
    protected expandable: boolean = true;

    /**
     * Called when the header is clicked.
     * Toggles the component between its expanded and collapsed state.
     */
    protected onHeaderClick(event: MouseEvent): void
    {
        if (event.defaultPrevented || !this.expandable)
        {
            return;
        }

        this.expanded = !this.expanded;
    }
}
