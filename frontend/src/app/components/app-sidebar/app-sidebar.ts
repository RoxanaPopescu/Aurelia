import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Router, NavModel } from "aurelia-router";

/**
 * Represents the sidebar of the app, which acts as the global navigation hub for authenticated users.
 */
@autoinject
export class AppSidebarCustomElement
{
    public constructor(router: Router)
    {
        this._router = router;
    }

    private readonly _router: Router;

    @computedFrom("router.navigation")
    protected get navModels(): NavModel[]
    {
        return this._router.navigation;
    }

    @computedFrom("router.currentInstruction")
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

        return childRouter.navigation;
    }

    /**
     * True if the sidebar is expanded, otherwise false.
     */
    protected expanded = false;

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
    @bindable({ defaultValue: false })
    public disableDashboard: boolean;

    protected toggleWidth()
    {
        this.expanded = !this.expanded;

        if (this.expanded)
        {
            document.documentElement.classList.remove("sideMenu--collapsed");
        }
        else
        {
            document.documentElement.classList.add("sideMenu--collapsed");
        }
    }
}
