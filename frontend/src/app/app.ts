import { PLATFORM, autoinject } from "aurelia-framework";
import { Router, RouterConfiguration, NavigationInstruction, Redirect, Next, PipelineStep } from "aurelia-router";
import { HistoryHelper } from "shared/infrastructure";
import { ToastService, ModalService } from "shared/framework";
import { UrlEncoder } from "shared/utilities";
import { IdentityService } from "./services/identity";
import { AuthorizationService } from "./services/authorization";
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
                name: "success",
                moduleId: PLATFORM.moduleName("app/toasts/success/success")
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
                name: "starred",
                moduleId: PLATFORM.moduleName("app/modules/starred/modals/starred/starred", "starred")
            },
            {
                name: "search",
                moduleId: PLATFORM.moduleName("app/modules/search/modals/search/search", "search")
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
                name: "image",
                moduleId: PLATFORM.moduleName("app/modals/dialogs/image/image")
            },
            {
                name: "account",
                moduleId: PLATFORM.moduleName("app/modules/account/modals/account/account")
            },
            {
                name: "verify-password",
                moduleId: PLATFORM.moduleName("app/modals/dialogs/verify-password/verify-password")
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
                route: ["", "index.html"],
                redirect: "routes"
            },
            {
                name: "account",
                route: "account",
                moduleId: PLATFORM.moduleName("./modules/account/pages/account/account")
            },
            {
                name: "kpi",
                route: "kpi",
                moduleId: PLATFORM.moduleName("./modules/kpi/kpi"),
                settings:
                {
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
                name: "dispatch",
                route: "dispatch",
                moduleId: PLATFORM.moduleName("./modules/dispatch/dispatch"),
                settings:
                {
                    claims:
                    [
                        "view-routes"
                    ]
                },
                title: routeTitles.dispatch,
                nav: true,
                href: "/dispatch",
                icon: "dispatch"
            },
            {
                name: "collection-points",
                route: "collection-points",
                moduleId: PLATFORM.moduleName("./modules/collection-points/collection-points"),
                settings:
                {
                    claims:
                    [
                        "view-routes"
                    ]
                },
                nav: false,
                href: "/collection-point"
            },
            {
                name: "route-planning",
                route: "route-planning",
                moduleId: PLATFORM.moduleName("./modules/route-planning/route-planning"),
                settings:
                {
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
                name: "distribution-centers",
                route: "distribution-centers",
                moduleId: PLATFORM.moduleName("./modules/distribution-centers/distribution-centers"),
                settings:
                {
                    claims:
                    [
                        "view-distribution-centers"
                    ]
                },
                title: routeTitles.distributionCenters,
                nav: true,
                href: "/distribution-centers",
                icon: "depots"
            },
            {
                name: "fleet",
                route: "fleet-management",
                moduleId: PLATFORM.moduleName("./modules/fleet/fleet"),
                settings:
                {
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
                moduleId: PLATFORM.moduleName("./modules/communication/communication"),
                settings:
                {
                    claims:
                    [
                        "view-communications"
                    ]
                },
                title: routeTitles.communication,
                nav: true,
                href: "/communication",
                icon: "communication"
            },
            {
                name: "organization",
                route: "organization",
                moduleId: PLATFORM.moduleName("./modules/organization/organization"),
                settings:
                {
                    claims:
                    [
                        "view-organizations"
                    ]
                },
                title: routeTitles.organization,
                nav: true,
                href: "/organization",
                icon: "settings"
            },
            {
                name: "unauthorized",
                route: "unauthorized",
                moduleId: PLATFORM.moduleName("./modules/unauthorized/pages/unauthorized/unauthorized", "unauthorized"),
                settings:
                {
                    scroll: true,
                    robots: "noindex,nofollow"
                }
            },

            ...
            ENVIRONMENT.name !== "production" ?
            [
                {
                    name: "design",
                    route: "design",
                    moduleId: PLATFORM.moduleName("./modules/_design/design"),
                    title: routeTitles.design
                }
            ] : []
        ];

        // Configure the routes.
        config.map(routeConfigs);

        // Map unknown routes.
        config.mapUnknownRoutes(
        {
            name: "unknown",
            route: "unknown",
            title: routeTitles.unknown,
            moduleId: PLATFORM.moduleName("./modules/unknown/unknown", "unknown"),
            settings:
            {
                scroll: true,
                robots: "noindex,nofollow"
            }
        });

        // Add a router pipeline step that checks whether the user is authorized to access the route.
        config.addPipelineStep("authorize", AuthorizePipelineStep);

        // Add a router pipeline step that attempts to close any open modals before navigating.
        config.addPipelineStep("preActivate", CloseModalsPipelineStep);

        // Add a router pipeline step that updates the attributes on the document element.
        config.addPipelineStep("preRender", UpdateAttributesPipelineStep);

        // Add a router pipeline step that updates the robots metadata in the document head.
        config.addPipelineStep("preRender", UpdateMetaRobotsPipelineStep);

        // Configure history usage.
        config.options.pushState = true;

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
     * @param identityService The `IdentityService` instance.
     * @param authorizationService The `AuthorizationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param urlEncoder The `UrlEncoder` instance.
     */
    public constructor(identityService: IdentityService, authorizationService: AuthorizationService, historyHelper: HistoryHelper, urlEncoder: UrlEncoder)
    {
        this._identityService = identityService;
        this._authorizationService = authorizationService;
        this._historyHelper = historyHelper;
        this._urlEncoder = urlEncoder;
    }

    private readonly _authorizationService: AuthorizationService;
    private readonly _identityService: IdentityService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _urlEncoder: UrlEncoder;

    /**
     * Called by the router when this step should execute.
     * @param navigationInstruction The current navigation instruction.
     * @param next A callback to indicate when pipeline processing should advance to the next step or be aborted.
     * @returns A promise that will be resolved when this step is complete.
     */
    public async run(navigationInstruction: NavigationInstruction, next: Next): Promise<any>
    {
        // Determine whether the user is authorized to access the route.
        const routeSettings = navigationInstruction.getAllInstructions().map(i => i.config.settings);
        const authorized = this._authorizationService.isAuthorizedForRoute(routeSettings);

        if (!authorized)
        {
            let redirectUrl: string;

            if (this._identityService.identity?.organization != null)
            {
                // Get the URL for the `unauthorized` page.

                redirectUrl = this._historyHelper.getRouteUrl("/unauthorized");

                // HACK: Restore the current URL after the redirect completes.

                const currentUrl = location.href;

                setTimeout(() => history.replaceState(history.state, "", currentUrl));
            }
            else
            {
                if (this._identityService.identity != null)
                {
                    // Get the URL for the `choose-organization` page.

                    redirectUrl = this._historyHelper.getRouteUrl("/account/choose-organization");
                }
                else
                {
                    // Get the URL for the `sign-in` page.

                    redirectUrl = this._historyHelper.getRouteUrl("/account/sign-in");
                }

                // Set the `url` parameter to the URL user was denied access to.

                const currentUrl = this._historyHelper.getCurrentRouteUrl();

                if (currentUrl !== "/")
                {
                    redirectUrl += `?url=${this._urlEncoder.encodeQueryValue(currentUrl)}`;
                }
            }

            return next.cancel(new Redirect(redirectUrl));
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
        const success = await this._modalService.closeAll("navigation");

        return success ? next() : next.cancel();
    }
}

/**
 * Represents a router pipeline step that updates the attributes on the document element.
 */
@autoinject
class UpdateAttributesPipelineStep implements PipelineStep
{
    /**
     * True if the document is initially allowed to scroll, otherwise false.
     */
    private readonly _scroll = document.documentElement.hasAttribute("scroll");

    /**
     * Called by the router when this step should execute.
     * @param instruction The current navigation instruction.
     * @param next A callback to indicate when pipeline processing should advance to the next step or be aborted.
     * @returns A promise that will be resolved when this step is complete.
     */
    public async run(instruction: NavigationInstruction, next: Next): Promise<any>
    {
        const instructions = instruction.getAllInstructions();

        // Resolve the value of the `scroll` setting associated with the current route config.
        const scroll = instructions.reduce((r, i) => i.config.settings?.scroll ?? r, this._scroll);

        // Toggle the attribute that indicates whether the document is allowed to scroll.
        document.documentElement.toggleAttribute("scroll", scroll);

        // Set the attribute that can be used to style the document, based on the name of the route.
        const route = instructions.map(i => i.config.name).join("/");
        document.documentElement.setAttribute("route", route);

        return next();
    }
}

/**
 * Represents a router pipeline step that updates the content of the `<meta name="robots">` element in the document head.
 */
@autoinject
class UpdateMetaRobotsPipelineStep implements PipelineStep
{
    /**
     * Called by the router when this step should execute.
     * @param instruction The current navigation instruction.
     * @param next A callback to indicate when pipeline processing should advance to the next step or be aborted.
     * @returns A promise that will be resolved when this step is complete.
     */
    public async run(instruction: NavigationInstruction, next: Next): Promise<any>
    {
        const instructions = instruction.getAllInstructions();

        // Resolve the value of the `robots` setting associated with the current route config.
        const robots = instructions.reduce((r, i) => i.config.settings?.robots ?? r, undefined);

        if (robots)
        {
            // Set the value of the `<meta name="robots">` element in the document head.
            const metaRobotsElement = document.head.querySelector("meta[name='robots']");
            metaRobotsElement!.setAttribute("content", robots);
        }

        return next();
    }
}
