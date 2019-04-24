import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class RoutePlanningModule
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
                title: routeTitles.list
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: routeTitles.details
            },
            {
                name: "settings list",
                route: "settings/list",
                moduleId: PLATFORM.moduleName("./modules/settings/list/list"),
                title: routeTitles.settingsList
            },
            {
                name: "settings details",
                route: "settings/details/:id",
                moduleId: PLATFORM.moduleName("./modules/settings/details/details"),
                title: routeTitles.settingsDetails
            },
            {
                name: "order-groups-list",
                route: "order-groups/list",
                moduleId: PLATFORM.moduleName("./modules/order-groups/list/list"),
                title: routeTitles.orderGroupList
            },
            {
                name: "order-groups-details",
                route: "order-groups/details/:id",
                moduleId: PLATFORM.moduleName("./modules/order-groups/details/details"),
                title: routeTitles.orderGroupDetails
            },
            {
                name: "simulations list",
                route: "simulations/list",
                moduleId: PLATFORM.moduleName("./modules/simulations/list/list"),
                title: routeTitles.simulationsList
            },
            {
                name: "simulations details",
                route: "simulations/details/:id",
                moduleId: PLATFORM.moduleName("./modules/simulations/details/details"),
                title: routeTitles.simulationsDetails
            },
        ]);
    }
}
