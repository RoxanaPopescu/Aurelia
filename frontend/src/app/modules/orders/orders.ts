import { IdentityService } from "app/services/identity";
import { autoinject, PLATFORM } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import routeTitles from "./resources/strings/route-titles.json";

const coopOutfitId = "573f5f57-a580-4c40-99b0-8fbeb396ebe9";

/**
 * Represents the module.
 */
@autoinject
export class OrdersModule
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
     * Legacy: What coop is using
     * TODO: This should be removed when we have figured out the real solution for new user system
     */
    public get showDAORelabel(): boolean
    {
        if (ENVIRONMENT.name === "development")
        {
            return true;
        }

        const identity = this._identityService.identity;

        if (identity == null)
        {
            return true;
        }

        const legacyOutfitIds = [coopOutfitId];

        return legacyOutfitIds.includes(identity.organization!.id);
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
                name: "list",
                route: "",
                moduleId: PLATFORM.moduleName("./modules/list/list"),
                settings:
                {
                    claims:
                    [
                        "view-orders"
                    ]
                },
                title: routeTitles.list,
                nav: false,
                href: "/orders"
            },
            {
                name: "details",
                route: "details/:id",
                moduleId: PLATFORM.moduleName("./modules/details/details"),
                settings:
                {
                    claims:
                    [
                        "view-orders"
                    ]
                }
            },
            {
                name: "dao-relabel",
                route: "dao-relabel",
                moduleId: PLATFORM.moduleName("./modules/dao-relabel/dao-relabel"),
                settings:
                {
                    claims:
                    [
                        "create-orders"
                    ]
                },
                title: routeTitles.daoRelabel,
                nav: false,
                icon: "orders"
            }
        ]);
    }
}
