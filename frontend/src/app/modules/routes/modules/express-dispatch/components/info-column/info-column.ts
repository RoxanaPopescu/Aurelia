import { ExpressRoute } from "app/model/express-route";
import { autoinject, bindable } from "aurelia-framework";
import { Workspace } from "../../services/workspace";

@autoinject
export class InfoColumnCustomElement
{
    /**
     * The workspace.
     */
    @bindable
    public workspace: Workspace;

    protected onBackClick(): void
    {
        history.back();
    }

    /**
     * Called when the `Remove ROUTE` icon is clicked on a the info column.
     * @param route The route to remove.
     */
    protected onRemoveRouteClick(route: ExpressRoute): void
    {
        this.workspace.selectedExpressRoutes.splice(this.workspace.selectedExpressRoutes.findIndex(r => r.id === route.id), 1);
        this.workspace.expressRoutes = this.workspace.expressRoutes.slice();
        this.workspace.selectedExpressRoutes = this.workspace.selectedExpressRoutes.slice();
    }
}
