import { bindable } from "aurelia-framework";
import { Workspace } from "../../services/workspace";
import { DriverRoute, ExpressRoute } from "app/model/express-route";

export class MapColumnCustomElement
{
    /**
     * The workspace.
     */
    @bindable
    public workspace: Workspace;

    protected onDriverRouteClick(route: DriverRoute): void
    {
        route.selected = !route.selected;

        if (route.selected)
        {
            this.workspace.selectedDriverRoutes.push(route);
        }
        else
        {
            this.workspace.selectedDriverRoutes.splice(this.workspace.selectedDriverRoutes.findIndex(r => r.driver.id === route.driver.id), 1);
        }

        this.workspace.driverRoutes = this.workspace.driverRoutes.slice();
        this.workspace.selectedDriverRoutes = this.workspace.selectedDriverRoutes.slice();
    }

    protected onExpressRouteClick(route: ExpressRoute): void
    {
        route.selected = !route.selected;

        if (route.selected)
        {
            this.workspace.selectedExpressRoutes.push(route);
        }
        else
        {
            this.workspace.selectedExpressRoutes.splice(this.workspace.selectedExpressRoutes.findIndex(r => r.id === route.id), 1);
        }

        this.workspace.expressRoutes = this.workspace.expressRoutes.slice();
        this.workspace.selectedExpressRoutes = this.workspace.selectedExpressRoutes.slice();
    }
}
