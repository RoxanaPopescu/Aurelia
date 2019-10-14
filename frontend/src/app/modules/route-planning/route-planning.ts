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
                moduleId: PLATFORM.moduleName("./modules/route-plans/list/list"),
                title: routeTitles.list,
                nav: false
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/route-plans/details/details"),
                title: routeTitles.details
            },
            {
                name: "settings-list",
                route: "settings/list",
                moduleId: PLATFORM.moduleName("./modules/route-settings/list/list"),
                title: routeTitles.settingsList,
                nav: true,
                icon: "settings"
            },
            {
                name: "settings-details",
                route: "settings/details/:id",
                moduleId: PLATFORM.moduleName("./modules/route-settings/details/details"),
                title: routeTitles.settingsDetails
            },
            {
                name: "settings-create",
                route: "settings/create",
                moduleId: PLATFORM.moduleName("./modules/route-settings/details/details"),
                title: routeTitles.settingsCreate
            },
            {
                name: "order-groups-list",
                route: "order-groups/list",
                moduleId: ENVIRONMENT.name === "development" ?
                    PLATFORM.moduleName("./modules/order-groups/_list/list") :
                    PLATFORM.moduleName("./modules/order-groups/list/list"),
                title: routeTitles.orderGroupsList,
                nav: true,
                icon: "order-groups"
            },
            {
                name: "order-groups-details",
                route: "order-groups/details/:id",
                moduleId: PLATFORM.moduleName("./modules/order-groups/_details/details"),
                title: routeTitles.orderGroupsDetails
            },
            {
                name: "simulations-list",
                route: "simulations/list",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/list/list"),
                title: routeTitles.simulationsList,
                nav: true,
                icon: "simulations"
            },
            {
                name: "simulations-details",
                route: "simulations/details/:id",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/details/details"),
                title: routeTitles.simulationsDetails
            },
            {
                name: "simulations-start",
                route: "simulations/start/:id",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/start/start"),
                title: routeTitles.simulationsDetails
            }
        ]);
    }
}
