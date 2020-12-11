import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { ThemeService } from "shared/framework";
import routeTitles from "./resources/strings/route-titles.json";

/**
 * Represents a page that provides routing and layout for
 * the pages within the `account` module.
 */
@autoinject
export class AccountPage
{
    /**
     * Creates a new instance of the type.
     * @param themeService The `ThemeService` instance.
     */
    public constructor(themeService: ThemeService)
    {
        this.showPoweredBy = !/^mover(-|$)/.test(themeService.theme.slug);
    }

    /**
     * True to show the `Powered by Mover`, otherwise false.
     */
    protected readonly showPoweredBy: boolean;

    /**
     * Called to configure the router for the page.
     * @param config The router configuration associated with the page.
     * @param router The router associated with the page.
     */
    public configureRouter(config: RouterConfiguration, router: Router): void
    {
        config.map(
        [
            {
                name: "sign-up",
                route: "sign-up",
                moduleId: PLATFORM.moduleName("./pages/sign-up/sign-up"),
                title: routeTitles.sighUp
            },
            {
                name: "activate",
                route: "activate",
                moduleId: PLATFORM.moduleName("./pages/activate/activate"),
                title: routeTitles.activate
            },
            {
                name: "sign-in",
                route: "sign-in",
                moduleId: PLATFORM.moduleName("./pages/sign-in/sign-in"),
                title: routeTitles.signIn
            },
            {
                name: "forgot-password",
                route: "forgot-password",
                moduleId: PLATFORM.moduleName("./pages/forgot-password/forgot-password"),
                title: routeTitles.forgotPassword
            },
            {
                name: "change-password",
                route: "change-password",
                moduleId: PLATFORM.moduleName("./pages/change-password/change-password"),
                title: routeTitles.changePassword
            },
            {
                name: "sign-out",
                route: "sign-out",
                moduleId: PLATFORM.moduleName("./pages/sign-out/sign-out"),
                title: routeTitles.sighOut
            }
        ]);
    }
}
