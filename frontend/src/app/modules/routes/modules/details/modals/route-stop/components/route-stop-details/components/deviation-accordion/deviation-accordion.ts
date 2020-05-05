import { autoinject, bindable } from "aurelia-framework";
import { RouteStopDeviation } from "app/model/route";

@autoinject
export class DeviationAccordionCustomElement
{
    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable
    public expanded: boolean = true;

    /**
     * The problem to present.
     */
    @bindable
    public model: RouteStopDeviation;

    /**
     * Called when the header is clicked.
     * Toggles the component between its expanded and collapsed state.
     */
    protected onHeaderClick(event: MouseEvent): void
    {
        this.expanded = !this.expanded;
    }
}
