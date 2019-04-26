import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";

@autoinject
export class DesignPage
{
    /**
     * Called to configure the router for the module.
     * @param config The router configuration associated with the module.
     * @param router The router associated with the module.
     */
    public configureRouter(config: RouterConfiguration, router: Router): void
    {
        router.title = "Design";

        config.map(
        [
            {
                name: "home",
                route: "",
                redirect: "palette"
            },
            {
                name: "palette",
                route: "palette",
                moduleId: PLATFORM.moduleName("./modules/palette/palette"),
                nav: true,
                title: "Palette"
            },
            {
                name: "demo",
                route: "demo",
                moduleId: PLATFORM.moduleName("./modules/demo/demo"),
                nav: true,
                title: "Demo"
            }
        ]);
    }
}
