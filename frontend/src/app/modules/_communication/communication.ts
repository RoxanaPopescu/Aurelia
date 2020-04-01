import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class OrdersModule
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
                settings:
                {
                    claims:
                    [
                        "view-communication"
                    ]
                },
                title: routeTitles.list,
                nav: false,
                href: "/orders/list"
            },
            {
                name: "details",
                route: "details/:slug",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-communication"
                    ]
                },
                title: routeTitles.details
            },
            {
                name: "create",
                route: "create",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-communication"
                    ]
                },
                title: routeTitles.details
            }
        ]);
    }
}
