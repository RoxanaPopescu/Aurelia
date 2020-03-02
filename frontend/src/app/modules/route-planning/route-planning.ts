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
                settings:
                {
                    claims:
                    [
                        "view-routeplans"
                    ]
                },
                title: routeTitles.list,
                nav: false
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/route-plans/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routeplans"
                    ]
                },
                title: routeTitles.details
            },
            {
                name: "settings-list",
                route: "settings/list",
                moduleId: ENVIRONMENT.name === "development" ?
                    PLATFORM.moduleName("./modules/settings/list/list") :
                    PLATFORM.moduleName("./modules/legacy-route-settings/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-settings"
                    ]
                },
                title: routeTitles.settingsList,
                nav: true,
                icon: "settings"
            },
            {
                route: "settings/details/:id",
                redirect: "settings/details/:id/general"
            },
            {
                name: "settings-details",
                route: "settings/details/:id/:tab",
                moduleId: ENVIRONMENT.name === "development" ?
                    PLATFORM.moduleName("./modules/settings/details/details") :
                    PLATFORM.moduleName("./modules/legacy-route-settings/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-settings"
                    ]
                },
                title: routeTitles.settingsDetails
            },
            {
                name: "settings-create",
                route: "settings/create",
                moduleId: ENVIRONMENT.name === "development" ?
                    PLATFORM.moduleName("./modules/settings/details/details") :
                    PLATFORM.moduleName("./modules/legacy-route-settings/details/details"),
                settings:
                {
                    claims:
                    [
                        "create-routeplan-settings"
                    ]
                },
                title: routeTitles.settingsCreate
            },
            {
                name: "order-groups-list",
                route: "order-groups/list",
                moduleId: PLATFORM.moduleName("./modules/order-groups/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-order-groups"
                    ]
                },
                title: routeTitles.orderGroupsList,
                nav: true,
                icon: "order-groups"
            },
            {
                name: "order-groups-details",
                route: "order-groups/details/:id",
                moduleId: PLATFORM.moduleName("./modules/order-groups/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-order-groups"
                    ]
                },
                title: routeTitles.orderGroupsDetails
            },
            {
                name: "order-groups-create",
                route: "order-groups/create",
                moduleId: PLATFORM.moduleName("./modules/order-groups/details/details"),
                settings:
                {
                    claims:
                    [
                        "create-order-group"
                    ]
                },
                title: routeTitles.orderGroupsDetails
            },
            {
                name: "simulations-list",
                route: "simulations/list",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-simulations"
                    ]
                },
                title: routeTitles.simulationsList,
                nav: true,
                icon: "simulations"
            },
            {
                name: "simulations-details",
                route: "simulations/details/:id",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-simulations"
                    ]
                },
                title: routeTitles.simulationsDetails
            },
            {
                name: "simulations-start",
                route: "simulations/start/:id",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/start/start"),
                settings:
                {
                    claims:
                    [
                        "create-routeplan-simulation"
                    ]
                },
                title: routeTitles.simulationsDetails
            }
        ]);
    }
}
