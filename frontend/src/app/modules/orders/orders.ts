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
                title: routeTitles.list,
                nav: false,
                href: "/orders/list"
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: routeTitles.details
            },
            {
                name: "edit",
                route: "edit/:id",
                moduleId: PLATFORM.moduleName("./modules/edit/edit"),
                title: routeTitles.edit
            },
            {
                name: "create",
                route: "create",
                moduleId: PLATFORM.moduleName("./modules/create/create"),
                title: routeTitles.create
            },

            ...
            ENVIRONMENT.name === "development" ?
            [
                {
                    name: "import",
                    route: "import",
                    moduleId: PLATFORM.moduleName("./modules/import/import"),
                    title: routeTitles.import,
                    nav: true,
                    href: "/orders/import",
                    icon: "import"
                }
            ] : []
        ]);
    }
}
