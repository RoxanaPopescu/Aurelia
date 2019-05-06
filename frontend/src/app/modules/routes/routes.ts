import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

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
                title: routeTitles.list,
                icon: "routes"
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: routeTitles.details
            },
            {
                name: "route-tracking",
                route: "route-tracking",
                moduleId: PLATFORM.moduleName("./modules/route-tracking/route-tracking"),
                nav: true,
                title: routeTitles.routeTracking,
                icon: "route-tracking"
            },
            {
                name: "driver-tracking",
                route: "driver-tracking",
                moduleId: PLATFORM.moduleName("./modules/driver-tracking/driver-tracking"),
                nav: true,
                title: routeTitles.driverTracking,
                icon: "driver-tracking"
            },
            {
                name: "auto-dispatch",
                route: "auto-dispatch",
                moduleId: PLATFORM.moduleName("./modules/auto-dispatch/auto-dispatch"),
                nav: true,
                title: routeTitles.autoDispatch,
                icon: "auto-dispatch"
            }
        ]);
    }
}
