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
                title: routeTitles.list
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
            }
        ]);
    }
}
