import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { AppRouter, NavModel } from "aurelia-router";
import { ThemeService } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { AuthorizationService } from "app/services/authorization";

/**
 * Represents the sidebar of the app, which acts as the global navigation hub for authenticated users.
 */
@autoinject
export class AppSidebarCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param router The `AppRouter` instance.
     * @param identityService The `IdentityService` instance.
     * @param themeService The `ThemeService` instance.
     * @param authorizationService The `AuthorizationService` instance.
     */
    public constructor(router: AppRouter, identityService: IdentityService, authorizationService: AuthorizationService, themeService: ThemeService)
    {
        this._router = router;
        this.identityService = identityService;
        this._authorizationService = authorizationService;

        this.expanded = localStorage.getItem("app-sidebar-expanded") === "true";
        document.documentElement.classList.toggle("sideMenu--collapsed", !this.expanded);

        this.showPoweredByLink = !/^mover(-|$)/.test(themeService.theme.slug);
    }

    private readonly _router: AppRouter;
    private readonly _authorizationService: AuthorizationService;

    /**
     * True if the "Powered by Mover Systems" link should be shown, otherwise false.
     */
    protected readonly showPoweredByLink: boolean;

    /**
     * The `IdentityService` instance.
     */
    protected readonly identityService: IdentityService;

    /**
     * The name identifying the environment.
     */
    protected readonly environment = ENVIRONMENT.name;

    /**
     * The navigation models for the top-level routes.
     */
    @computedFrom("_router.navigation", "_router.currentInstruction", "identityService.identity")
    protected get navModels(): NavModel[]
    {
        return this._router.navigation
            .filter(m => this._authorizationService.isAuthorizedForRoute(
            [
                m.config.settings
            ]));
    }

    /**
     * The navigation models for the child routes for the current top-level route.
     */
    @computedFrom("_router.navigation", "_router.currentInstruction", "identityService.identity")
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
     * True if a child nav model is active, otherwise false.
     */
    @computedFrom("childNavModels")
    protected get hasActiveChildNavModel(): boolean
    {
        return this.childNavModels?.some(navModel => navModel.isActive) ?? false;
    }

    /**
     * True if the sidebar is expanded, otherwise false.
     */
    protected expanded = true;

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
