import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";

/**
 * Represents the module.
 */
@autoinject
export class FleetModule
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
                redirect: "drivers"
            },
            {
                name: "list",
                route: "drivers",
                moduleId: PLATFORM.moduleName("./modules/list/list"),
                title: "List"
            },
            {
                name: "details",
                route: "drivers/edit/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: "Details"
            }
        ]);
    }
}
