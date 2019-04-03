import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration, NavigationInstruction, Redirect, Next, PipelineStep, RouteConfig } from "aurelia-router";
import { IdentityService } from "./services/user/identity";
import { ModalService } from "shared/framework";

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

        // Dialogs.
        modalService.register("confirm", PLATFORM.moduleName("app/modals/dialogs/confirm/confirm"));
    }

    private readonly identityService: IdentityService;

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

        // Remove titles for the 'home' modules.
        router.transformTitle = title => ["Projects", "Locales", "Strings"].includes(title) ? "" : title;

        // Add the authorization step.
        if (false)
        {
            config.addPipelineStep("authorize", AuthorizePipelineStep);
        }

        // Configure the routes.
        config.map(this.filterRoutesByOutfit(
        [
            {
                name: "default",
                route: "",
                redirect: "routes"
            },
            {
                name: "account",
                route: "account",
                moduleId: PLATFORM.moduleName("./modules/user/account/account")
            },

            {
                name: "profile",
                route: "profile",
                moduleId: PLATFORM.moduleName("./modules/domain/profile/profile")
            },
            {
                name: "kpi",
                route: "kpi",
                moduleId: PLATFORM.moduleName("./modules/domain/kpi/kpi"),
                settings:
                {
                    outfit: "fulfiller",
                    roles: ["user"]
                },
                nav: true,
                title: "KPI",
                href: "/kpi",
                icon: "m-kpi"
            },
            {
                name: "orders",
                route: "orders",
                moduleId: PLATFORM.moduleName("./modules/domain/orders/orders"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Orders",
                href: "/orders",
                icon: "m-orders"
            },
            {
                name: "routes",
                route: "routes",
                moduleId: PLATFORM.moduleName("./modules/domain/routes/routes"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Routes",
                href: "/routes",
                icon: "m-routes"
            },
            {
                name: "route-planning",
                route: "route-planning",
                moduleId: PLATFORM.moduleName("./modules/domain/route-planning/route-planning"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Route planning",
                href: "/route-planning",
                icon: "m-route-planning"
            },
            {
                name: "depots",
                route: "depots",
                moduleId: PLATFORM.moduleName("./modules/domain/depots/depots"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Depots",
                href: "/depots",
                icon: "m-depots"
            },
            {
                name: "fleet",
                route: "fleet-management",
                moduleId: PLATFORM.moduleName("./modules/domain/fleet/fleet"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Fleet",
                href: "/fleet-management",
                icon: "m-fleet"
            },
            {
                name: "communication",
                route: "communication",
                moduleId: PLATFORM.moduleName("./modules/domain/communication/communication"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Communication",
                href: "/communication",
                icon: "m-communication"
            },
            {
                name: "departments",
                route: "departments",
                moduleId: PLATFORM.moduleName("./modules/domain/departments/departments"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Departments",
                href: "/departments",
                icon: "m-departments"
            },
            {
                name: "users",
                route: "users",
                moduleId: PLATFORM.moduleName("./modules/domain/users/users"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Users",
                href: "/users",
                icon: "m-users"
            },
            {
                name: "agreements",
                route: "agreements",
                moduleId: PLATFORM.moduleName("./modules/domain/agreements/agreements"),
                settings:
                {
                    roles: ["user"]
                },
                nav: true,
                title: "Agreements",
                href: "/agreements",
                icon: "m-agreements"
            },

            ...
            ENVIRONMENT.name === "development" ?
            [
                {
                    name: "design",
                    route: "design",
                    moduleId: PLATFORM.moduleName("./modules/design/design")
                }
            ] : []

        ]));
    }

    /**
     * Filters the specified routes to include only those available to
     * the type of outfit to which the user belongs.
     * @param routes The routes to filter.
     * @returns The filtered routes.
     */
    private filterRoutesByOutfit(routes: RouteConfig[]): RouteConfig[]
    {
        return routes.filter(r =>
            r.settings == null || r.settings.outfit == null ||
            (this.identityService.identity != null && this.identityService.identity.outfit.type === r.settings.outfit));
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
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this.identityService = identityService;
    }

    private readonly identityService: IdentityService;

    /**
     * Called by the router when this step should execute.
     * @param navigationInstruction The current navigation instruction.
     * @param next A callback to indicate when pipeline processing should advance to the next step or be aborted.
     * @returns A promise that will be resolved when this step is complete.
     */
    public async run(navigationInstruction: NavigationInstruction, next: Next): Promise<any>
    {
        const requiredRoles = navigationInstruction.getAllInstructions()
            .reduce((r, i) => i.config.settings.roles ? r.concat(i.config.settings.roles) : r, [] as string[]);

        if (requiredRoles.length > 0)
        {
            const identity = this.identityService.identity;

            if (identity == null || !requiredRoles.every(r => identity.roles.has(r)))
            {
                return next.cancel(new Redirect("account/sign-in"));
            }
        }

        return next();
    }
}
