import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { IdentityService } from "app/services/user/identity";

@autoinject
export class SignInModule
{
    public constructor(identityService: IdentityService, router: Router)
    {
        this.identityService = identityService;
        this.router = router;
    }

    private readonly identityService: IdentityService;
    private readonly router: Router;

    public email: string;

    public password: string;

    public remember = true;

    public async signIn(): Promise<void>
    {
        if (await this.identityService.authenticate(this.email, this.password, this.remember))
        {
            await this.router.navigate("/user");
        }
        else
        {
            alert("Sign in failed.");
        }
    }
}
