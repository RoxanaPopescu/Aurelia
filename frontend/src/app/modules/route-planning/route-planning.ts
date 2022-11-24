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
                redirect: "plans"
            },
            {
                name: "list",
                route: "plans",
                moduleId: PLATFORM.moduleName("./modules/plans/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplans"
                    ]
                },
                title: routeTitles.routePlans,
                nav: false,
                icon: "ico-route-planning"
            },
            {
                name: "details",
                route: "plans/details/:id",
                moduleId: PLATFORM.moduleName("./modules/plans/details/details"),
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
                name: "rule-sets-list",
                route: "rule-sets",
                moduleId: PLATFORM.moduleName("./modules/rule-sets/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-settings"
                    ]
                },
                title: routeTitles.rulesList,
                nav: true,
                icon: "ico-gear"
            },
            {
                name: "rule-sets-details",
                route: [ "rule-sets/details/:id", "rule-sets/create" ],
                moduleId: PLATFORM.moduleName("./modules/rule-sets/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-settings"
                    ]
                },
                title: routeTitles.rulesDetails
            },
            {
                name: "order-groups-list",
                route: "order-groups",
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
                icon: "ico-order-groups"
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
                        "create-order-groups"
                    ]
                },
                title: routeTitles.orderGroupsDetails
            }
        ]);
    }
}
