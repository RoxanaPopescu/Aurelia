import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";

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
                route: "",
                moduleId: PLATFORM.moduleName("./modules/list/list"),
                nav: true,
                title: "All routes",
                icon: "business"
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: "Details"
            },
            {
                name: "live-tracking",
                route: "live-tracking",
                moduleId: PLATFORM.moduleName("./modules/live-tracking/live-tracking"),
                nav: true,
                title: "Live tracking",
                icon: "business"
            },
            {
                name: "driver-tracking",
                route: "driver-tracking",
                moduleId: PLATFORM.moduleName("./modules/driver-tracking/driver-tracking"),
                nav: true,
                title: "Driver tracking",
                icon: "business"
            },
            {
                name: "auto-dispatch",
                route: "auto-dispatch",
                moduleId: PLATFORM.moduleName("./modules/auto-dispatch/auto-dispatch"),
                nav: true,
                title: "Auto dispatch",
                icon: "business"
            }
        ]);
    }
}
