import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration, NavigationInstruction } from "aurelia-router";
import { IdentityService } from "app/services/user/identity";

@autoinject
export class AccountModule
{
    public constructor(identityService: IdentityService)
    {
        this.identityService = identityService;
    }

    private readonly identityService: IdentityService;

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
                name: "sign-up",
                route: "sign-up",
                moduleId: PLATFORM.moduleName("./modules/sign-up/sign-up"),
                title: "Sign up"
            },
            {
                name: "sign-in",
                route: "sign-in",
                moduleId: PLATFORM.moduleName("./modules/sign-in/sign-in"),
                title: "Sign in"
            },
            {
                name: "sign-out",
                route: "sign-out",
                navigationStrategy: async (instruction: NavigationInstruction) =>
                {
                    await this.identityService.unauthenticate();
                    instruction.config.redirect = "sign-in";
                },
                settings:
                {
                    roles: ["user"]
                }
            }
        ]);
    }
}
