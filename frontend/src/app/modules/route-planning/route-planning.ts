import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";
import { IdentityService } from "app/services/identity";

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
        const moverOutfitId = "d19d0cfb-2c08-4a7e-96d6-730f02c95c56";
        const coopOutfitId = "36e39e32-38c1-45c1-acdd-24505b5ede6b";
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
                redirect: "list"
            },
            {
                name: "list",
                route: "list",
                moduleId: PLATFORM.moduleName("./modules/route-plans/list/list"),
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
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/route-plans/details/details"),
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
                route: "rule-sets/list",
                moduleId: this.legacyOutfit ?
                    PLATFORM.moduleName("./modules/legacy-route-settings/list/list") :
                    PLATFORM.moduleName("./modules/settings/list/list"),
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
                    PLATFORM.moduleName("./modules/settings/details/details"),
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
                    PLATFORM.moduleName("./modules/settings/details/details"),
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
                route: "order-groups/list",
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
                route: "simulations/list",
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
