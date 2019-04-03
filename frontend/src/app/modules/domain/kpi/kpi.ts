import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";

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
                title: "Fulfillers"
            },
            {
                name: "consignors",
                route: "consignors",
                moduleId: PLATFORM.moduleName("./modules/consignors/consignors"),
                title: "Consignors"
            }
        ]);
    }
}
