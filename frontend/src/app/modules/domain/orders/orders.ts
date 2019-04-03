import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";

/**
 * Represents the module.
 */
@autoinject
export class OrdersModule
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
                route: "",
                moduleId: PLATFORM.moduleName("./modules/list/list"),
                nav: true,
                title: "Orders",
                icon: "business"
            },
            {
                name: "details",
                route: ":orderSlug",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: "Details"
            }
        ]);
    }
}
