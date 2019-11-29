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
                        "view-routes"
                    ]
                },
                title: routeTitles.list,
                nav: false,
                icon: "routes"
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routes"
                    ]
                },
                title: routeTitles.details
            },
            {
                name: "route-tracking",
                route: "route-tracking",
                moduleId: PLATFORM.moduleName("./modules/route-tracking/route-tracking"),
                settings:
                {
                    claims:
                    [
                        "view-routes"
                    ]
                },
                title: routeTitles.routeTracking,
                nav: true,
                icon: "route-tracking"
            },
            {
                name: "driver-tracking",
                route: "driver-tracking",
                moduleId: PLATFORM.moduleName("./modules/driver-tracking/driver-tracking"),
                settings:
                {
                    claims:
                    [
                        "view-routes"
                    ]
                },
                title: routeTitles.driverTracking,
                nav: true,
                icon: "driver-tracking"
            },
            {
                name: "auto-dispatch",
                route: "auto-dispatch",
                moduleId: PLATFORM.moduleName("./modules/auto-dispatch/auto-dispatch"),
                settings:
                {
                    claims:
                    [
                        "view-fulfiller-dispatch"
                    ]
                },
                title: routeTitles.autoDispatch,
                nav: true,
                icon: "auto-dispatch"
            },
            {
                name: "express-dispatch",
                route: "express-dispatch",
                moduleId: PLATFORM.moduleName("./modules/express-dispatch/express-dispatch"),
                settings:
                {
                    claims:
                    [
                        "edit-routes"
                    ]
                },
                title: routeTitles.dispatch,
                nav: true,
                icon: "express-dispatch"
            },

            ...
            ENVIRONMENT.name === "development" ?
            [
                {
                    name: "templates-list",
                    route: "templates/list",
                    moduleId: PLATFORM.moduleName("./modules/templates/list/list"),
                    settings:
                    {
                        claims:
                        [
                            "view-route-templates"
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
                            "view-route-templates"
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
                            "create-route-template"
                        ]
                    },
                    title: routeTitles.newTemplate
                }
            ] : []
        ]);
    }
}
