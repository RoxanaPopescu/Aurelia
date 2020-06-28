import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";
import { IdentityService } from "app/services/identity";

const moverOutfitId = "2ab2712b-5f60-4439-80a9-a58379cce885";
const coopOutfitId = "573f5f57-a580-4c40-99b0-8fbeb396ebe9";

/**
 * Represents the module.
 */
@autoinject
export class RoutePlanningModule
{
    /**
     * Creates a new instance of the class.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this._identityService = identityService;
    }

    private readonly _identityService: IdentityService;

    /**
     * Routeplan rule sets supports two implementations.
     * Legacy: What coop and Mover is still using
     * New: What we are building for Ikea.
     * TODO: This should be removed when we move all customers to the new routeplans
     */
    private get legacyOutfit(): boolean {
        const legacyOutfitIds = [moverOutfitId, coopOutfitId];

        const identity = this._identityService.identity;
        if (identity == null) {
            return false;
        }

        return legacyOutfitIds.includes(identity.outfit.id);
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
                redirect: "plans"
            },
            {
                name: "list",
                route: "plans",
                moduleId: this.legacyOutfit ?
                    PLATFORM.moduleName("./modules/legacy-route-plans/list/list") :
                    PLATFORM.moduleName("./modules/plans/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplans"
                    ]
                },
                title: routeTitles.list,
                nav: false
            },
            {
                name: "details",
                route: "plans/details/:id",
                moduleId: this.legacyOutfit ?
                    PLATFORM.moduleName("./modules/legacy-route-plans/details/details") :
                    PLATFORM.moduleName("./modules/plans/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routeplans"
                    ]
                },
                title: routeTitles.details
            },
            {
                name: "rule-sets-list",
                route: "rule-sets",
                moduleId: this.legacyOutfit ?
                    PLATFORM.moduleName("./modules/legacy-route-settings/list/list") :
                    PLATFORM.moduleName("./modules/rule-sets/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-settings"
                    ]
                },
                title: routeTitles.rulesList,
                nav: true,
                icon: "settings"
            },
            {
                name: "rule-sets-details",
                route: [ "rule-sets/details/:id", "rule-sets/create" ],
                moduleId: this.legacyOutfit ?
                    PLATFORM.moduleName("./modules/legacy-route-settings/details/details") :
                    PLATFORM.moduleName("./modules/rule-sets/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-settings"
                    ]
                },
                title: routeTitles.rulesDetails
            },
            {
                name: "rule-sets-create",
                route: "rule-sets/create",
                moduleId: this.legacyOutfit ?
                    PLATFORM.moduleName("./modules/legacy-route-settings/details/details") :
                    PLATFORM.moduleName("./modules/rule-sets/details/details"),
                settings:
                {
                    claims:
                    [
                        "create-routeplan-settings"
                    ]
                },
                title: routeTitles.rulesCreate
            },
            {
                name: "order-groups-list",
                route: "order-groups",
                moduleId: PLATFORM.moduleName("./modules/order-groups/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-order-groups"
                    ]
                },
                title: routeTitles.orderGroupsList,
                nav: true,
                icon: "order-groups"
            },
            {
                name: "order-groups-details",
                route: "order-groups/details/:id",
                moduleId: PLATFORM.moduleName("./modules/order-groups/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-order-groups"
                    ]
                },
                title: routeTitles.orderGroupsDetails
            },
            {
                name: "order-groups-create",
                route: "order-groups/create",
                moduleId: PLATFORM.moduleName("./modules/order-groups/details/details"),
                settings:
                {
                    claims:
                    [
                        "create-order-group"
                    ]
                },
                title: routeTitles.orderGroupsDetails
            },
            {
                name: "simulations-list",
                route: "simulations",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-simulations"
                    ]
                },
                title: routeTitles.simulationsList,
                nav: true,
                icon: "simulations"
            },
            {
                name: "simulations-details",
                route: "simulations/details/:id",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-simulations"
                    ]
                },
                title: routeTitles.simulationsDetails
            },
            {
                name: "simulations-start",
                route: "simulations/start/:id",
                moduleId: PLATFORM.moduleName("./modules/route-simulations/start/start"),
                settings:
                {
                    claims:
                    [
                        "create-routeplan-simulation"
                    ]
                },
                title: routeTitles.simulationsDetails
            }
        ]);
    }
}
