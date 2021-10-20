import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class DistributionCentersModule
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
                        "view-distribution-centers"
                    ]
                },
                title: routeTitles.list
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-distribution-centers"
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
                        "create-distribution-centers"
                    ]
                },
                title: routeTitles.create
            }
        ]);
    }
}
