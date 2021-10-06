import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class KpiModule
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
                moduleId: PLATFORM.moduleName("./modules/fulfillers/fulfillers"),
                settings:
                {
                    claims:
                    [
                        "view-kpis"
                    ]
                },
                title: routeTitles.kpi,
                icon: "kpi",
                nav: false
            }
        ]);
    }
}
