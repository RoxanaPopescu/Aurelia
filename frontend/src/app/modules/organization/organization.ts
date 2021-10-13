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
                settings:
                {
                    claims:
                    [
                        "view-organization"
                    ]
                },
                title: routeTitles.profile
            },
            {
                name: "users",
                route: "users",
                moduleId: PLATFORM.moduleName("./modules/users/users"),
                settings:
                {
                    claims:
                    [
                        "view-users"
                    ]
                },
                title: routeTitles.users,
                nav: true,
                icon: "users"
            },
            {
                name: "teams",
                route: "teams",
                moduleId: PLATFORM.moduleName("./modules/teams/teams"),
                settings:
                {
                    claims:
                    [
                        "view-teams"
                    ]
                },
                title: routeTitles.teams,
                nav: true,
                icon: "departments"
            },
            {
                name: "team-details",
                route: "teams/:teamId",
                moduleId: PLATFORM.moduleName("./modules/team-details/team-details"),
                settings:
                {
                    claims:
                    [
                        "view-teams"
                    ]
                },
                title: routeTitles.teamDetails
            },
            {
                name: "roles",
                route: "roles",
                moduleId: PLATFORM.moduleName("./modules/roles/roles"),
                settings:
                {
                    claims:
                    [
                        "view-roles"
                    ]
                },
                title: routeTitles.roles,
                nav: true,
                icon: "md-rules"
            },

            ...
            ENVIRONMENT.name !== "production" ?
            [
                {
                    name: "connections",
                    route: "connections",
                    moduleId: PLATFORM.moduleName("./modules/connections/connections"),
                    settings:
                    {
                        claims:
                        [
                            "view-connections"
                        ]
                    },
                    title: routeTitles.connections,
                    nav: true,
                    icon: "md-hub"
                }
            ] : []
        ]);
    }
}
