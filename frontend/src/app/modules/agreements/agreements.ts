import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import { ModalService } from "shared/framework";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the module.
 */
@autoinject
export class AgreementsModule
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        modalService.register("add-fulfiller-agreement", PLATFORM.moduleName("app/modules/agreements/modals/add-fulfiller-agreement/add-fulfiller-agreement"));
        modalService.register("add-consignor-agreement", PLATFORM.moduleName("app/modules/agreements/modals/add-consignor-agreement/add-consignor-agreement"));
    }

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
                title: routeTitles.list
            }
        ]);
    }
}
