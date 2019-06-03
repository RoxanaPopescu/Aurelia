import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";

/**
 * Represents the module.
 */
@autoinject
export class RoutesModule
{
    /**
     * Called to configure the router for the module.
     * @param config The router configuration associated with the module.
     * @param router The router associated with the module.
     */
    public configureRouter(config: RouterConfiguration, router: Router): void
    {
        config.map(
        [
            {
                name: "default",
                route: "",
                redirect: "list"
            },
            {
                name: "list",
                route: "list",
                moduleId: PLATFORM.moduleName("./modules/list/list"),
                title: "List",
                nav: true,
                icon: "business"
            },
            {
                name: "details",
                route: ":routeSlug",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: "Details"
            },
            {
                name: "route-tracking",
                route: "route-tracking",
                moduleId: PLATFORM.moduleName("./modules/route-tracking/route-tracking"),
                title: "Live tracking",
                nav: true,
                icon: "business"
            }
        ]);
    }
}
