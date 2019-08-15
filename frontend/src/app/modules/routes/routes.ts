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
                route: "list",
                moduleId: ENVIRONMENT.name === "development"
                    ? PLATFORM.moduleName("./modules/_list/list")
                    : PLATFORM.moduleName("./modules/list/list"),
                title: routeTitles.list,
                nav: false,
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
                title: routeTitles.routeTracking,
                nav: true,
                icon: "route-tracking"
            },
            {
                name: "driver-tracking",
                route: "driver-tracking",
                moduleId: PLATFORM.moduleName("./modules/driver-tracking/driver-tracking"),
                title: routeTitles.driverTracking,
                nav: true,
                icon: "driver-tracking"
            },
            {
                name: "auto-dispatch",
                route: "auto-dispatch",
                moduleId: PLATFORM.moduleName("./modules/auto-dispatch/auto-dispatch"),
                title: routeTitles.autoDispatch,
                nav: true,
                icon: "auto-dispatch"
            },
            {
                name: "express-dispatch",
                route: "express-dispatch",
                moduleId: PLATFORM.moduleName("./modules/express-dispatch/express-dispatch"),
                title: routeTitles.dispatch,
                nav: true,
                icon: "fleet"
            }
        ]);
    }
}
