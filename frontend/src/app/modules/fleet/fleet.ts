import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

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
                nav: true,
                title: routeTitles.list,
                href: "/drivers",
                icon: "drivers"
            },
            {
                name: "details",
                route: "drivers/edit/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: routeTitles.details
            },
            {
                name: "create",
                route: "drivers/create",
                moduleId: PLATFORM.moduleName("./modules/create/create"),
                title: routeTitles.create
            },

            ...
            ENVIRONMENT.name === "development" ?
            [
                {
                    name: "driver-disposition",
                    route: "driver-disposition",
                    moduleId: PLATFORM.moduleName("./modules/driver-disposition/driver-disposition"),
                    nav: true,
                    title: routeTitles.driverDisposition,
                    href: "/fleet-management/driver-disposition",
                    icon: "forecast"
                }
            ] : []
        ]);
    }
}
