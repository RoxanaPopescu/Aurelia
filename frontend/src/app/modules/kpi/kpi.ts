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
                redirect: "fulfillers"
            },
            {
                name: "fulfillers",
                route: "fulfillers",
                moduleId: PLATFORM.moduleName("./modules/fulfillers/fulfillers"),
                settings:
                {
                    claims:
                    [
                        "view-kpis"
                    ]
                },
                title: routeTitles.fulfillers,
                icon: "kpi",
                nav: true
            },
            {
                name: "consignors",
                route: "consignors",
                moduleId: PLATFORM.moduleName("./modules/consignors/consignors"),
                settings:
                {
                    claims:
                    [
                        "view-kpis"
                    ]
                },
                title: routeTitles.consignors,
                icon: "kpi",
                nav: true
            }
        ]);
    }
}
