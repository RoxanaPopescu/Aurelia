import { autoinject, bindable } from "aurelia-framework";
import { RouteStopProblem } from "app/model/route";

@autoinject
export class ProblemAccordionCustomElement
{
    /**
     * True if the component is expanded, otherwise false.
     */
    @bindable
    protected expanded: boolean = false;

    /**
     * The problem to present.
     */
    @bindable
    protected model: RouteStopProblem;

    /**
     * Called when the header is clicked.
     * Toggles the component between its expanded and collapsed state.
     */
    protected onHeaderClick(event: MouseEvent): void
    {
        this.expanded = !this.expanded;
    }
}
