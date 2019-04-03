import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";

/**
 * Represents the module.
 */
@autoinject
export class DepotsModule
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
                name: "list",
                route: "",
                moduleId: PLATFORM.moduleName("./modules/list/list"),
                title: "List"
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: "Details"
            }
        ]);
    }
}
