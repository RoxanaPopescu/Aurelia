import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class DispatchModule
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
                name: "automatic-dispatch",
                route: "",
                moduleId: PLATFORM.moduleName("./modules/automatic-dispatch-list/automatic-dispatch-list"),
                settings:
                {
                    claims:
                    [
                        "view-routes"
                    ]
                },
                title: routeTitles.automaticDispatch,
                nav: false,
                icon: "auto-dispatch"
            },
            {
                name: "automatic-dispatch-details",
                route: "automatic-dispatch/:id",
                moduleId: PLATFORM.moduleName("./modules/automatic-dispatch-job/automatic-dispatch-job"),
                settings:
                {
                    claims:
                    [
                        "view-routes"
                    ]
                },
                title: routeTitles.automaticDispatch
            },
            {
                name: "automatic-dispatch-settings",
                route: "automatic-dispatch-settings",
                moduleId: PLATFORM.moduleName("./modules/automatic-dispatch-settings/automatic-dispatch-settings"),
                settings:
                {
                    claims:
                    [
                        "edit-routes"
                    ]
                },
                title: routeTitles.automaticDispatchSettings,
                nav: true,
                icon: "settings"
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
            {
                name: "driver-assignment",
                route: "driver-assignment",
                moduleId: PLATFORM.moduleName("./modules/driver-assignment/driver-assignment"),
                settings:
                {
                    claims:
                    [
                        "edit-routes"
                    ]
                },
                title: routeTitles.driverAssignment,
                nav: true,
                icon: "fleet"
            }
        ]);
    }
}
