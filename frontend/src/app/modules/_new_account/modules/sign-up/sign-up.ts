import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { AccountService } from "app/services/user/account";

@autoinject
export class SignUpModule
{
    public constructor(accountService: AccountService, router: Router)
    {
        this.accountService = accountService;
        this.router = router;
    }

    private readonly accountService: AccountService;
    private readonly router: Router;

    public username: string;

    public fullName: string;

    public preferredName: string;

    public email: string;

    public password: string;

    public agreeToTerms = true;

    public async signUp(): Promise<void>
    {
        try
        {
            await this.accountService.create(this.password, this.fullName, this.preferredName, this.email);

            await this.router.navigate("/user/profile");
        }
        catch (error)
        {
            alert("Sign up failed.");
        }
    }
}
