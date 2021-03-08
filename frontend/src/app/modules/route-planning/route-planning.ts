import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";
import { coopOrganizationId, IdentityService, moverOrganizationId } from "app/services/identity";


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
     * TODO: This should be removed when we move all customers to the new routeplans
     */
    private get showLegacy(): boolean
    {
        const identity = this._identityService.identity;

        if (identity == null)
        {
            return false;
        }

        const legacyOrganizationIds = [moverOrganizationId, coopOrganizationId];
        return legacyOrganizationIds.includes(identity.outfit.id);
    }

    /**
     * Routeplan rule sets supports two implementations.
     * Legacy: What coop and Mover is still using
     * TODO: This should be removed when we move all customers to the new routeplans
     */
    private get showNew(): boolean
    {
        const identity = this._identityService.identity;

        if (identity == null)
        {
            return true;
        }

        const legacyOrganizationIds = [coopOrganizationId];

        return !legacyOrganizationIds.includes(identity.outfit.id);
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
                redirect: this.showLegacy ? "plans-legacy" : "plans"
            },
            {
                name: "list-legacy",
                route: "plans-legacy",
                moduleId: PLATFORM.moduleName("./modules/legacy-route-plans/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplans"
                    ]
                },
                title: routeTitles.routePlans,
                nav: false
            },
            {
                name: "details-legacy",
                route: "plans-legacy/details/:id",
                moduleId: PLATFORM.moduleName("./modules/legacy-route-plans/details/details"),
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
                name: "rule-sets-list-legacy",
                route: "rule-sets-legacy",
                moduleId: PLATFORM.moduleName("./modules/legacy-route-settings/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-settings"
                    ]
                },
                title: routeTitles.rulesList,
                nav: this.showLegacy,
                icon: "settings"
            },
            {
                name: "rule-sets-details-legacy",
                route: [ "rule-sets-legacy/details/:id", "rule-sets-legacy/create" ],
                moduleId: PLATFORM.moduleName("./modules/legacy-route-settings/details/details"),
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
                name: "list",
                route: "plans",
                moduleId: PLATFORM.moduleName("./modules/plans/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplans"
                    ]
                },
                title: (this.showNew && this.showLegacy) ? routeTitles.routePlansNew : routeTitles.routePlans,
                nav: (this.showNew && this.showLegacy),
                icon: "route-planning"
            },
            {
                name: "details",
                route: "plans/details/:id",
                moduleId: PLATFORM.moduleName("./modules/plans/details/details"),
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
                moduleId: PLATFORM.moduleName("./modules/rule-sets/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-routeplan-settings"
                    ]
                },
                title: (this.showLegacy && this.showNew) ? routeTitles.rulesListNew : routeTitles.rulesList,
                nav: this.showNew,
                icon: "settings"
            },
            {
                name: "rule-sets-details",
                route: [ "rule-sets/details/:id", "rule-sets/create" ],
                moduleId: PLATFORM.moduleName("./modules/rule-sets/details/details"),
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
