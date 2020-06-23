import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class FleetModule
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
                redirect: "drivers"
            },
            {
                name: "list",
                route: "drivers",
                moduleId: PLATFORM.moduleName("./modules/drivers/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-drivers"
                    ]
                },
                title: routeTitles.list,
                nav: false,
                href: "/fleet-management/drivers",
                icon: "fleet"
            },
            {
                name: "details",
                route: "drivers/details/:id",
                moduleId: PLATFORM.moduleName("./modules/drivers/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-drivers",
                        "view-vehicles"
                    ]
                },
                title: routeTitles.details
            },
            {
                name: "create",
                route: "drivers/create",
                moduleId: PLATFORM.moduleName("./modules/drivers/details/details"),
                settings:
                {
                    claims:
                    [
                        "invite-driver"
                    ]
                },
                title: routeTitles.create
            },
            {
                name: "list-vehicles",
                route: "vehicles",
                moduleId: PLATFORM.moduleName("./modules/vehicles/vehicles"),
                settings:
                {
                    claims:
                    [
                        "view-vehicles"
                    ]
                },
                title: routeTitles.vehicleList,
                nav: true,
                href: "/fleet-management/vehicles",
                icon: "vehicles"
            },
            {
                name: "dispatch-default",
                route: "dispatch",
                redirect: "dispatch/forecasts"
            },
            {
                name: "dispatch",
                route: "dispatch/*state",
                moduleId: PLATFORM.moduleName("./modules/dispatch/dispatch"),
                settings:
                {
                    claims:
                    [
                        ["view-forecast", "view-prebooking", "view-routes"]
                    ]
                },
                title: routeTitles.dispatch,
                nav: true,
                href: "/fleet-management/dispatch",
                icon: "dispatch"
            },
            {
                name: "assign-routes",
                route: "assign-routes/:origin/:ids",
                moduleId: PLATFORM.moduleName("./modules/assign-routes/assign-routes"),
                settings:
                {
                    claims:
                    [
                        "edit-routes"
                    ]
                },
                title: routeTitles.assignRoutes
            },
            {
                name: "create-prebooking",
                route: "create-prebooking/:id",
                moduleId: PLATFORM.moduleName("./modules/create-prebooking/create-prebooking"),
                settings:
                {
                    claims:
                    [
                        "create-prebooking"
                    ]
                },
                title: routeTitles.createPrebooking
            },
            {
                name: "forecasts",
                route: "forecasts",
                moduleId: PLATFORM.moduleName("./modules/forecasts/forecasts"),
                settings:
                {
                    claims:
                    [
                        "view-forecast"
                    ]
                },
                title: routeTitles.forecasts,
                nav: true,
                href: "/fleet-management/forecasts",
                icon: "forecast"
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
                name: "create-multiple",
                route: "drivers/create-multiple",
                moduleId: PLATFORM.moduleName("./modules/drivers/create-multiple/create-multiple"),
                settings:
                {
                    claims:
                    [
                        "invite-driver"
                    ]
                },
                title: routeTitles.createMultipleDrivers,
                nav: true,
                href: "/fleet-management/drivers/create-multiple",
                icon: "fleet"
            },
        ]);
    }
}
