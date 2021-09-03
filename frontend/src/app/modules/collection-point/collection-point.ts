import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration } from "aurelia-router";

/**
 * Represents the module.
 */
@autoinject
export class CollectionPointModule
{
    /**
     * Called to configure the router for the module.
     * @param config The router configuration associated with the module.
     * @param router The router associated with the module.
     */
    public configureRouter(config: RouterConfiguration): void
    {
        config.map(
        [
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
                }
            }
        ]);
    }
}
