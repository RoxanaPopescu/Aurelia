import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class RoutesModule
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
                        "view-routes"
                    ]
                },
                title: routeTitles.list,
                nav: false,
                icon: "routes"
            },
            {
                name: "details",
                route: "details/:slug",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routes"
                    ]
                }
            },
            {
                name: "live-tracking",
                route: "live-tracking",
                moduleId: PLATFORM.moduleName("./modules/live-tracking/live-tracking"),
                settings:
                {
                    claims:
                    [
                        "view-routes",
                        "assign-driver-route"
                    ]
                },
                title: routeTitles.liveTracking,
                nav: true,
                icon: "route-tracking"
            },
            {
                name: "auto-contractor-assignment",
                route: "auto-contractor-assignment",
                moduleId: PLATFORM.moduleName("./modules/auto-contractor-assignment/auto-contractor-assignment"),
                settings:
                {
                    claims:
                    [
                        "view-automatic-organization-route-assignments"
                    ]
                },
                title: routeTitles.autoContractorAssignment,
                nav: true,
                icon: "auto-dispatch"
            },
            ...
            ENVIRONMENT.name !== "production" ?
            [
                {
                    name: "templates-list",
                    route: "templates",
                    moduleId: PLATFORM.moduleName("./modules/templates/list/list"),
                    settings:
                    {
                        claims:
                        [
                            "view-routes"
                        ]
                    },
                    title: routeTitles.templates,
                    nav: true,
                    icon: "templates"
                },
                {
                    name: "templates-details",
                    route: "templates/details/:id",
                    moduleId: PLATFORM.moduleName("./modules/templates/details/details"),
                    settings:
                    {
                        claims:
                        [
                            "view-routes"
                        ]
                    },
                    title: routeTitles.templateDetails
                },
                {
                    name: "templates-create",
                    route: "templates/create",
                    moduleId: PLATFORM.moduleName("./modules/templates/details/details"),
                    settings:
                    {
                        claims:
                        [
                            "edit-routes"
                        ]
                    },
                    title: routeTitles.newTemplate
                },
                {
                    name: "generate-test",
                    route: "generate-test",
                    moduleId: PLATFORM.moduleName("./modules/generate-test-routes/generate-test-routes"),
                    title: routeTitles.test,
                    nav: false,
                    icon: "settings"
                }
            ] : []
        ]);
    }
}
