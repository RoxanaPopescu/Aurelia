import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class OrganizationModule
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
                redirect: "profile"
            },
            {
                name: "profile",
                route: "profile",
                moduleId: PLATFORM.moduleName("./modules/profile/profile"),
                title: routeTitles.profile,
            },
            {
                name: "users",
                route: "users",
                moduleId: PLATFORM.moduleName("./modules/users/users"),
                title: routeTitles.roles
            },
            {
                name: "teams",
                route: "teams",
                moduleId: PLATFORM.moduleName("./modules/teams/teams"),
                title: routeTitles.teams
            },
            {
                name: "roles",
                route: "roles",
                moduleId: PLATFORM.moduleName("./modules/roles/roles"),
                title: routeTitles.roles
            }
        ]);
    }
}