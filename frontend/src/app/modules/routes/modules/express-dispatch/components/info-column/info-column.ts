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
     * Called when the `Remove vehicle` icon is clicked on a vehicle.
     * Asks the user to confirm, then deletes the stop from the route.
     * @param vehicle The vehicle to remove.
     */
     protected async onRemoveRouteClick(route: ExpressRoute): Promise<void>
     {
         // FIXME: REMOVE
     }
}
