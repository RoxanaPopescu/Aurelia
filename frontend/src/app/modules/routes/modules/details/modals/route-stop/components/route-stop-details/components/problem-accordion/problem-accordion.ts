import { autoinject, bindable } from "aurelia-framework";
import { RouteStopProblem } from "app/model/route";

@autoinject
export class ProblemAccordionCustomElement
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
    public model: RouteStopProblem;

    /**
     * Called when the header is clicked.
     * Toggles the component between its expanded and collapsed state.
     */
    protected onHeaderClick(event: MouseEvent): void
    {
        this.expanded = !this.expanded;
    }
}
