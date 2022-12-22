import { PLATFORM, autoinject } from "aurelia-framework";
import { Router, RouterConfiguration, NavigationInstruction, Next, PipelineStep } from "aurelia-router";
import { ToastService, ModalService } from "shared/framework";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents the app module.
 */
@autoinject
export class AppModule
{
    /**
     * Creates a new instance of the type.
     * @param toastService The `ToastService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(toastService: ToastService, modalService: ModalService)
    {
        this.modalService = modalService;
        this.toastService = toastService;

        this.configureToasts();
    }

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
                icon: "ico-routes"
            },
        ];

        // Configure the routes.
        config.map(routeConfigs);

        // Map unknown routes.
        config.mapUnknownRoutes(
        {
            name: "unknown",
            route: "unknown",
            title: routeTitles.unknown,
            moduleId: PLATFORM.moduleName("./modules/unknown/pages/unknown/unknown", "unknown"),
            settings:
            {
                scroll: true,
                robots: "noindex,nofollow"
            }
        });

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
