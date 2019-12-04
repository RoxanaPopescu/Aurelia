import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Router, NavModel } from "aurelia-router";
import { AuthorizationService } from "app/services/authorization";

/**
 * Represents the sidebar of the app, which acts as the global navigation hub for authenticated users.
 */
@autoinject
export class AppSidebarCustomElement
{
    public constructor(router: Router, authorizationService: AuthorizationService)
    {
        this._router = router;
        this._authorizationService = authorizationService;

        this.expanded = localStorage.getItem("app-sidebar-expanded") === "true";
        document.documentElement.classList.toggle("sideMenu--collapsed", !this.expanded);
    }

    private readonly _router: Router;
    private readonly _authorizationService: AuthorizationService;

    protected readonly environment = ENVIRONMENT.name;

    @computedFrom("_router.navigation")
    protected get navModels(): NavModel[]
    {
        return this._router.navigation
            .filter(m => this._authorizationService.isAuthorizedForRoute(
            [
                m.config.settings
            ]));
    }

    @computedFrom("_router.currentInstruction")
    protected get childNavModels(): NavModel[] | undefined
    {
        if (this._router.currentInstruction == null)
        {
            return undefined;
        }

        const instructions = this._router.currentInstruction.getAllInstructions();
        const childRouter = instructions[instructions.length - 1].router;

        if (childRouter === this._router || childRouter.navigation.length === 0)
        {
            return undefined;
        }

        return childRouter.navigation
            .filter(m => this._authorizationService.isAuthorizedForRoute(
            [
                this._router.currentInstruction.config.settings,
                m.config.settings
            ]));
    }

    /**
     * True if the sidebar is expanded, otherwise false.
     */
    protected expanded = true;

    /**
     * True to reduce the visibility of the shadow, otherwise false.
     * This should only be true when presented together with a modal overlay with the same surface color.
     */
    @bindable({ defaultValue: false })
    public reduceShadow: boolean;

    /**
     * True to disable toggling of the dashboard, otherwise false.
     * This should only be false when presented as the landing page after sign in.
     */
    @bindable({ defaultValue: true })
    public disableDashboard: boolean;

    protected toggleWidth(): void
    {
        this.expanded = !this.expanded;
        localStorage.setItem("app-sidebar-expanded", `${this.expanded}`);
        document.documentElement.classList.toggle("sideMenu--collapsed", !this.expanded);
    }
}
