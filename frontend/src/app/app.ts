import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration, NavigationInstruction, Redirect, Next, PipelineStep } from "aurelia-router";
import { ToastService, ModalService } from "shared/framework";
import { AuthorizationService } from "./services/authorization";
import { IdentityService } from "./services/identity";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the app module.
 */
@autoinject
export class AppModule
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param toastService The `ToastService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(identityService: IdentityService, toastService: ToastService, modalService: ModalService)
    {
        this.identityService = identityService;
        this.modalService = modalService;
        this.toastService = toastService;

        this.configureToasts();
        this.configureModals();
    }

    /**
     * The `IdentityService` instance.
     */
    protected readonly identityService: IdentityService;

    /**
     * The `ToastService` instance.
     */
    protected readonly toastService: ToastService;

    /**
     * The `ModalService` instance.
     */
    protected readonly modalService: ModalService;

    /**
     * Called to configure the toasts for the app.
     */
    public configureToasts(): void
    {
        const toastConfigs =
        [
            {
                name: "error",
                moduleId: PLATFORM.moduleName("app/toasts/error/error")
            },
            {
                name: "warning",
                moduleId: PLATFORM.moduleName("app/toasts/warning/warning")
            },
            {
                name: "info",
                moduleId: PLATFORM.moduleName("app/toasts/info/info")
            }
        ];

        // Configure the toasts.
        toastConfigs.forEach(config => this.toastService.register(config.name, config.moduleId));
    }

    /**
     * Called to configure the modals for the app.
     */
    public configureModals(): void
    {
        const modalConfigs =
        [
            {
                name: "dashboard",
                moduleId: PLATFORM.moduleName("app/modals/overlays/dashboard/dashboard")
            },
            {
                name: "search",
                moduleId: PLATFORM.moduleName("app/modals/panels/search/search")
            },
            {
                name: "starred",
                moduleId: PLATFORM.moduleName("app/modals/panels/starred/starred")
            },
            {
                name: "add",
                moduleId: PLATFORM.moduleName("app/modals/panels/add/add")
            },
            {
                name: "notifications",
                moduleId: PLATFORM.moduleName("app/modals/panels/notifications/notifications")
            },
            {
                name: "confirm-discard",
                moduleId: PLATFORM.moduleName("app/modals/dialogs/confirm-discard/confirm-discard")
            },
            {
                name: "account",
                moduleId: PLATFORM.moduleName("app/modules/account/modals/account/account")
            }
        ];

        // Configure the modals.
        modalConfigs.forEach(config => this.modalService.register(config.name, config.moduleId));
    }

    /**
     * Called to configure the router for the module.
     * @param config The router configuration associated with the module.
     * @param router The router associated with the module.
     */
    public configureRouter(config: RouterConfiguration, router: Router): void
    {
        const routeConfigs =
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
                name: "account/reset-password",
                route: "reset-password",
                moduleId: PLATFORM.moduleName("./modules/account/modules/reset-password/reset-password"),
                title: routeTitles.resetPassword
            },
            {
                name: "kpi",
                route: "kpi",
                moduleId: PLATFORM.moduleName("./modules/kpi/kpi"),
                settings:
                {
                    outfits: ["fulfiller", "consignor"],
                    claims:
                    [
                        "view-kpis"
                    ]
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
                        "view-routeplans",
                        "view-routeplan-settings"
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
                        "view-depot"
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
                        "view-drivers",
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
                moduleId: ENVIRONMENT.name === "production"
                    ? PLATFORM.moduleName("./modules/communication/communication")
                    : PLATFORM.moduleName("./modules/_communication/communication"),
                settings:
                {
                    outfits: ["fulfiller"],
                    claims:
                    [
                        "view-communication"
                    ]
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
                        "view-departments"
                    ]
                },
                title: routeTitles.departments,
                nav: true,
                href: "/departments",
                icon: "departments"
            },
            {
                name: "agreements",
                route: "agreements",
                moduleId: PLATFORM.moduleName("./modules/agreements/agreements"),
                settings:
                {
                    outfits: ["fulfiller"],
                    claims:
                    [
                        "view-agreements"
                    ]
                },
                title: routeTitles.agreements,
                nav: true,
                href: "/agreements",
                icon: "agreements"
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
                        "view-users"
                    ]
                },
                title: routeTitles.users,
                nav: true,
                href: "/users",
                icon: "users"
            },

            ...
            ENVIRONMENT.name === "development" ?
            [
                {
                    name: "design",
                    route: "design",
                    moduleId: PLATFORM.moduleName("./modules/_design/design"),
                    title: routeTitles.design
                }
            ] : []
        ];

        const handleUnknownRoutes = () =>
        {
            return {
                route: "page-not-found",
                title: routeTitles.pageNotFound,
                moduleId: PLATFORM.moduleName("./modules/page-not-found/page-not-found")
            };
        };

        // Configure the routes.
        config.map(routeConfigs);

        // Add page not found
        config.mapUnknownRoutes(handleUnknownRoutes);

        // Add a router pipeline step that checks whether the user is authorized to access the route.
        config.addPipelineStep("authorize", AuthorizePipelineStep);

        // Add a router pipeline step that attempts to close any open modals before navigating.
        config.addPipelineStep("preActivate", CloseModalsPipelineStep);

        // Configure history usage.
        config.options.pushState = ENVIRONMENT.pushState;

        // Configure title generation.
        config.title = document.title;
        router.titleSeparator = " — ";
        router.transformTitle = title => ["List"].includes(title) ? "" : title;
    }
}

/**
 * Represents a router pipeline step that determines whether the user is authorized to access the route.
 * If the user is authenticated, a failed authorization will cause an error to be thrown.
 * If the user is not authenticated, a failed validation will result in a redirect to the sign-in route.
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
        const routeSettings = navigationInstruction.getAllInstructions().map(i => i.config.settings);
        const authorized = this._authorizationService.isAuthorizedForRoute(routeSettings);

        if (!authorized)
        {
            return next.cancel(new Redirect("account/sign-in"));
        }

        return next();
    }
}

/**
 * Represents a router pipeline step that attempts to close any open modals before navigating.
 * If a modal refuses to close, navigation will be cancelled.
 */
@autoinject
class CloseModalsPipelineStep implements PipelineStep
{
    /**
     * Creates a new instance of the type.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        this._modalService = modalService;
    }

    private readonly _modalService: ModalService;

    /**
     * Called by the router when this step should execute.
     * @param instruction The current navigation instruction.
     * @param next A callback to indicate when pipeline processing should advance to the next step or be aborted.
     * @returns A promise that will be resolved when this step is complete.
     */
    public async run(instruction: NavigationInstruction, next: Next): Promise<any>
    {
        await this._modalService.closeAll("navigation");

        return next();
    }
}
