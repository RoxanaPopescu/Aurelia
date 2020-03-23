import { autoinject, bindable, bindingMode } from "aurelia-framework";

@autoinject
export class AccordionCustomElement
{
    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public expanded: boolean = false;

    /**
     * True if the component can be expanded, otherwise false.
     */
    @bindable
    public expandable: boolean = true;

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
