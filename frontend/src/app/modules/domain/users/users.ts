import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";

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
                moduleId: PLATFORM.moduleName("./modules/users/users"),
                title: "Users"
            },
            {
                name: "roles",
                route: "management/roles",
                moduleId: PLATFORM.moduleName("./modules/roles/roles"),
                title: "Roles"
            },
            {
                name: "details",
                route: "management/users/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                title: "Details"
            }
        ]);
    }
}
