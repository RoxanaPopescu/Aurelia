import { autoinject } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { ModalService } from "shared/framework/services/modal";
import { RouteService } from "app/model/services/route";
import { RouteInfo } from "app/model/entities/route/list";

/**
 * Represents the module.
 */
@autoinject
export class ListModule
{
    public constructor(routeService: RouteService, modalService: ModalService)
    {
        this._routeService = routeService;
    }

    private readonly _routeService: RouteService;

    /**
     * The routes to present.
     */
    protected routes: RouteInfo[];

    /**
     * The name identifying the currently selected status tab.
     */
    protected statusTab = "unassigned";

    protected tableAppearance = "rows";

    protected tableSelection = "none";

    protected tableRowAccent = undefined;

    /**
     * The sorting to use.
     */
    protected sorting =
    {
        "reference": "ascending",
        "status": "descending",
        "start-date": null,
        "start-address": null,
        "stops": null
    };

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @param routeConfig The route configuration.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: never, routeConfig: RouteConfig): Promise<void>
    {
        // Get the domain models.
        this.routes = await this._routeService.getAll();
    }

    protected onRowClick(route: any): boolean
    {
        console.log("row click:", route.slug);

        return true;
    }

    protected onToggleRow(route: any, value: boolean): boolean
    {
        console.log("toggle row:", value, route.slug);

        return true;
    }

    protected onToggleAll(value: boolean): boolean
    {
        console.log("toggle all:", value);

        return true;
    }
}
