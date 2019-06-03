import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration, NavigationInstruction, Redirect, Next, PipelineStep } from "aurelia-router";
import { ModalService } from "shared/framework";
import { AuthorizationService } from "./services/authorization";
import routeTitles from "./resources/strings/route-titles.json";
import { IdentityService } from "./services/identity";

/**
 * Represents the app module.
 */
@autoinject
export class AppModule
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(identityService: IdentityService, modalService: ModalService)
    {
        this.identityService = identityService;

        // Register global modals.

        // Panels.
        modalService.register("dashboard", PLATFORM.moduleName("app/modals/overlays/dashboard/dashboard"));
        modalService.register("search", PLATFORM.moduleName("app/modals/panels/search/search"));
        modalService.register("starred", PLATFORM.moduleName("app/modals/panels/starred/starred"));
        modalService.register("add", PLATFORM.moduleName("app/modals/panels/add/add"));
        modalService.register("notifications", PLATFORM.moduleName("app/modals/panels/notifications/notifications"));

        // Dialogs.
        modalService.register("confirm", PLATFORM.moduleName("app/modals/dialogs/confirm/confirm"));
    }

    protected readonly identityService: IdentityService;

    /**
     * Called to configure the router for the module.
     * @param config The router configuration associated with the module.
     * @param router The router associated with the module.
     */
    public configureRouter(config: RouterConfiguration, router: Router): void
    {
        config.options.pushState = ENVIRONMENT.pushState;
        config.title = document.title;

        // Set the title separator.
        router.titleSeparator = " — ";

        // Remove unwanted route titles.
        router.transformTitle = title => ["List"].includes(title) ? "" : title;

        // Add the authorization step.
        config.addPipelineStep("authorize", AuthorizePipelineStep);

        // Configure the routes.
        config.map(
        [
            {
                name: "default",
                route: "",
                redirect: "routes"
            },
            {
                name: "account/sign-in",
                route: "account/sign-in",
                moduleId: PLATFORM.moduleName("./modules/account/modules/sign-in/sign-in"),
                title: routeTitles.signIn
            },
            {
                name: "account/activate",
                route: "activation",
                moduleId: PLATFORM.moduleName("./modules/account/modules/activate/activate"),
                title: routeTitles.activateAccount
            },
            {
                name: "profile",
                route: "profile",
                moduleId: PLATFORM.moduleName("./modules/profile/profile"),
                settings:
                {
                    outfits: ["fulfiller", "consignor"]
                }
            },
            {
                name: "kpi",
                route: "kpi",
                moduleId: PLATFORM.moduleName("./modules/kpi/kpi"),
                settings:
                {
                    outfits: ["fulfiller", "consignor"],
                    claims: ["view-kpis"]
                },
                title: routeTitles.kpi,
                nav: true,
                href: "/kpi",
                icon: "kpi"
            },
            {
                name: "orders",
                route: "orders",
                moduleId: PLATFORM.moduleName("./modules/orders/orders"),
                settings:
                {
                    outfits: ["fulfiller", "consignor"],
                    claims:
                    [
                        "create-order",
                        "edit-order",
                        "view-orders"
                    ]
                },
                title: routeTitles.orders,
                nav: true,
                href: "/orders",
                icon: "orders"
            },
            {
                name: "routes",
                route: "routes",
                moduleId: PLATFORM.moduleName("./modules/routes/routes"),
                settings:
                {
                    outfits: ["fulfiller", "consignor"],
                    claims:
                    [
                        "edit-routes",
                        "view-routes"
                    ]
                },
                title: routeTitles.routes,
                nav: true,
                href: "/routes",
                icon: "routes"
            },
            {
                name: "route-planning",
                route: "route-planning",
                moduleId: PLATFORM.moduleName("./modules/route-planning/route-planning"),
                settings:
                {
                    outfits: ["fulfiller"],
                    claims:
                    [
                        "edit-routeplan",
                        "edit-routeplan-settings",
                        "view-routeplans",
                        "view-routeplan-settings",
                        "create-routeplan",
                        "create-routeplan-settings"
                    ]
                },
                title: routeTitles.routePlanning,
                nav: true,
                href: "/route-planning",
                icon: "route-planning"
            },
            {
                name: "depots",
                route: "depots",
                moduleId: PLATFORM.moduleName("./modules/depots/depots"),
                settings:
                {
                    outfits: ["fulfiller"],
                    claims:
                    [
                        "create-depot",
                        "view-depot",
                        "edit-depot"
                    ]
                },
                title: routeTitles.depots,
                nav: true,
                href: "/depots",
                icon: "depots"
            },
            {
                name: "fleet",
                route: "fleet-management",
                moduleId: PLATFORM.moduleName("./modules/fleet/fleet"),
                settings:
                {
                    outfits: ["fulfiller"],
                    claims:
                    [
                        "invite-driver",
                        "view-drivers",
                        "edit-vehicle",
                        "create-vehicle",
                        "view-vehicles"
                    ]
                },
                title: routeTitles.fleet,
                nav: true,
                href: "/fleet-management",
                icon: "fleet"
            },
            {
                name: "communication",
                route: "communication",
                moduleId: PLATFORM.moduleName("./modules/communication/communication"),
                settings:
                {
                    outfits: ["fulfiller"]
                },
                title: routeTitles.communication,
                nav: true,
                href: "/communication",
                icon: "communication"
            },
            {
                name: "departments",
                route: "departments",
                moduleId: PLATFORM.moduleName("./modules/departments/departments"),
                settings:
                {
                    outfits: ["fulfiller", "consignor"],
                    claims:
                    [
                        "create-departments",
                        "edit-departments",
                        "view-departments"
                    ]
                },
                title: routeTitles.departments,
                nav: true,
                href: "/departments",
                icon: "departments"
            },
            {
                name: "users",
                route: "users",
                moduleId: PLATFORM.moduleName("./modules/users/users"),
                settings:
                {
                    outfits: ["fulfiller", "consignor"],
                    claims:
                    [
                        "create-user",
                        "edit-user",
                        "view-users"
                    ]
                },
                title: routeTitles.users,
                nav: true,
                href: "/users",
                icon: "users"
            },
            {
                name: "agreements",
                route: "agreements",
                moduleId: PLATFORM.moduleName("./modules/agreements/agreements"),
                settings:
                {
                    outfits: ["fulfiller"]
                },
                title: routeTitles.agreements,
                nav: true,
                href: "/agreements",
                icon: "agreements"
            },

            ...
            ENVIRONMENT.name === "development" ?
            [
                {
                    name: "new-routes",
                    route: "new-routes",
                    moduleId: PLATFORM.moduleName("./modules/_new_routes/routes")
                },
                {
                    name: "design",
                    route: "design",
                    moduleId: PLATFORM.moduleName("./modules/_design/design"),
                    title: routeTitles.design
                }
            ] : []

        ]);
    }
}

/**
 * Represents a router pipeline step that determines whether the user is authorized to access a route.
 * If the user is authenticated, a failed authorization will cause an error to be thrown.
 * If the user is not authenticated, a failed validation will result in a redirect to the sign in page.
 */
@autoinject
class AuthorizePipelineStep implements PipelineStep
{
    /**
     * Creates a new instance of the type.
     * @param authorizationService The `AuthorizationService` instance.
     */
    public constructor(authorizationService: AuthorizationService)
    {
        this._authorizationService = authorizationService;
    }

    private readonly _authorizationService: AuthorizationService;

    /**
     * Called by the router when this step should execute.
     * @param navigationInstruction The current navigation instruction.
     * @param next A callback to indicate when pipeline processing should advance to the next step or be aborted.
     * @returns A promise that will be resolved when this step is complete.
     */
    public async run(navigationInstruction: NavigationInstruction, next: Next): Promise<any>
    {
        const resolvedRouteSettings =
        {
            outfits: navigationInstruction.getAllInstructions()
                .reduce((outfits, i) => i.config.settings.outfit ? outfits.concat(i.config.settings.outfit) : outfits, [] as string[]),

            claims: navigationInstruction.getAllInstructions()
                .reduce((claims, i) => i.config.settings.claims ? claims.concat(i.config.settings.claims) : claims, [] as string[])
        };

        const authorized = this._authorizationService.isAuthorizedForRoute(resolvedRouteSettings);

        if (!authorized)
        {
            return next.cancel(new Redirect("account/sign-in"));
        }

        return next();
    }
}
