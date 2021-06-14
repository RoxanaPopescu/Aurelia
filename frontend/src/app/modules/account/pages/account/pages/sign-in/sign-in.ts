import { autoinject } from "aurelia-framework";
import { NavigationCommand, Redirect } from "aurelia-router";
import { HistoryHelper } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { AccountModel } from "app/modules/account/components/account/account";
import { ISignUpModel } from "app/modules/account/components/account/components/sign-up/sign-up";

/**
 * Represents the URL parameters expected by the page.
 */
interface ISignInPageParams
{
    /**
     * The URL to navigate to after signing in, or undefiend to not navigate.
     */
    url?: string;
}

@autoinject
export class SignInPage
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(identityService: IdentityService, historyHelper: HistoryHelper)
    {
        this._identityService = identityService;
        this._historyHelper = historyHelper;
    }

    private readonly _identityService: IdentityService;
    private readonly _historyHelper: HistoryHelper;

    /**
     * The model for the account component.
     */
    protected model: AccountModel;

    /**
     * Called by the framework before the page activates.
     * @param params The route parameters from the URL.
     */
    public canActivate(params: ISignInPageParams): NavigationCommand | boolean
    {
        if (this._identityService.identity != null && this._identityService.organization == null)
        {
            return new Redirect(params.url ? `/account/choose-organization?url=${params.url}` : "/account/choose-organization");
        }

        if (this._identityService.identity != null)
        {
            return new Redirect(params.url ?? "/");
        }

        return true;
    }

    /**
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: ISignInPageParams): void
    {
        this.model =
        {
            view: "sign-in",
            onViewChanged: () => this.onViewChanged(),
            onSignedUp: () => this.onSignedUp("/"),
            onSignedIn: () => this.onSignedIn(params.url ?? "/")
        };
    }

    /**
     * Called when the account view has changed.
     */
    private async onViewChanged(): Promise<void>
    {
        await this._historyHelper.navigate(`/account/${this.model.view}`, { replace: true });
        this._historyHelper.setTitle();
    }

    /**
     * Called when the sign up operation completes.
     * @param url The URL to navigate to.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    private async onSignedUp(url: string): Promise<void>
    {
        const model = this.model as ISignUpModel;

        await this._identityService.authenticate(model.email!, model.password!);

        await this._historyHelper.navigate(url);
    }

    /**
     * Called when the sign in operation completes.
     * @param url The URL to navigate to.
     */
    private async onSignedIn(url: string): Promise<void>
    {
        // TODO: If only one organization exists, automatically authorize and navigate to that.

        await this._historyHelper.navigate(`/account/choose-organization?url=${url}`, { replace: true });
    }
}
