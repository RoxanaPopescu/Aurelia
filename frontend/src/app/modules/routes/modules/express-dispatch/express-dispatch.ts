import { autoinject } from "aurelia-framework";
import { Workspace } from "./services/workspace";

/**
 * Represents the page.
 */
@autoinject
export class ExpressDispatchPage
{
    protected workspace = new Workspace();

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        history.replaceState({ ...history.state, view: "express-dispatch-home" }, "", location.href);

        window.addEventListener("popstate", this.onPopState);
    }

    /**
     * Called by the framework when the component is dettached from the DOM.
     */
    public dettached(): void
    {
        window.removeEventListener("popstate", this.onPopState);
    }

    /**
     * Called when the user navigates back from the merge view,
     * either explicitly or by completing the merge.
     */
    private readonly onPopState = (event: PopStateEvent) =>
    {
        if (event.state.view === "express-dispatch-merge")
        {
            if (this.workspace.selectedExpressRoutes.length !== 0 && this.workspace.selectedDriverRoutes.length === 1)
            {
                this.workspace.isMerging = true;
                this.workspace.tab = "info";
            }
        }
        else if (event.state.view === "express-dispatch-home")
        {
            this.workspace.isMerging = false;
            this.workspace.tab = "routes";
        }
    }
}
