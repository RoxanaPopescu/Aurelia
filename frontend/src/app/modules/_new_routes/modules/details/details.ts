import { autoinject } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { ModalService } from "shared/framework/services/modal";
import { RouteService } from "app/model/services/route";
import { Route } from "app/model/entities/route/details";


/**
 * Represents the URL parameters expected by the module.
 */
interface IDetailsModuleParams
{
    /**
     * The slug identifying the route.
     */
    routeSlug: string;
}

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    public constructor(routeService: RouteService, modalService: ModalService)
    {
        this._routeService = routeService;
    }

    private readonly _routeService: RouteService;

    /**
     * The route to present.
     */
    protected route: Route;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @param routeConfig The route configuration.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IDetailsModuleParams, routeConfig: RouteConfig): Promise<void>
    {
        // Get the domain models.
        this.route = await this._routeService.get(params.routeSlug);

        // Set the route title.
        routeConfig.navModel!.setTitle(this.route.slug);
    }
}
