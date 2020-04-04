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
                name: "list",
                route: "",
                moduleId: PLATFORM.moduleName("./modules/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-orders"
                    ]
                },
                title: routeTitles.list,
                nav: false,
                href: "/orders/list"
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-orders"
                    ]
                },
                title: routeTitles.details
            },
            {
                name: "edit",
                route: "edit/:id",
                moduleId: PLATFORM.moduleName("./modules/edit/edit"),
                settings:
                {
                    claims:
                    [
                        "edit-order"
                    ]
                },
                title: routeTitles.edit
            },
            {
                name: "create",
                route: "create",
                moduleId: PLATFORM.moduleName("./modules/create/create"),
                settings:
                {
                    claims:
                    [
                        "create-order"
                    ]
                },
                title: routeTitles.create
            },

            ...
            ENVIRONMENT.name === "development" ?
            [
                {
                    name: "import",
                    route: "import",
                    moduleId: PLATFORM.moduleName("./modules/import/import"),
                    settings:
                    {
                        claims:
                        [
                            "create-order"
                        ]
                    },
                    title: routeTitles.import,
                    nav: true,
                    href: "/orders/import",
                    icon: "import"
                }
            ] : []
        ]);
    }
}
