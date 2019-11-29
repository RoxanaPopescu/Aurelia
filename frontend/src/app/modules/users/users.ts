import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class UsersModule
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
                name: "home",
                route: "",
                redirect: "management/users"
            },
            {
                name: "list",
                route: "management/users",
                moduleId: PLATFORM.moduleName("./modules/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-users"
                    ]
                },
                title: routeTitles.list,
                nav: false
            },
            {
                name: "roles",
                route: "management/roles",
                moduleId: PLATFORM.moduleName("./modules/roles/roles"),
                settings:
                {
                    claims:
                    [
                        "view-users"
                    ]
                },
                title: routeTitles.roles,
                nav: true,
                icon: "roles"
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-users"
                    ]
                },
                title: routeTitles.details
            },
            {
                name: "create",
                route: "create",
                moduleId: PLATFORM.moduleName("./modules/create/create"),
                settings:
                {
                    claims:
                    [
                        "create-user"
                    ]
                },
                title: routeTitles.create
            }
        ]);
    }
}
