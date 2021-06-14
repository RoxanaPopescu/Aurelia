import { autoinject } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { AccountModel } from "app/modules/account/components/account/account";
import { ISignUpModel } from "app/modules/account/components/account/components/sign-up/sign-up";

/**
 * Represents the URL parameters expected by the page.
 */
interface IConfirmEmailPageParams
{
    /**
     * The account confirmation token.
     */
    token: string;
}

@autoinject
export class ConfirmEmailPage
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
     * Called by the framework when the page is activating.
     * @param params The route parameters from the URL.
     */
    public activate(params: IConfirmEmailPageParams): void
    {
        this.model =
        {
            view: "confirm-email",
            token: params.token,
            onViewChanged: () => this.onViewChanged(),
            onConfirmedEmail: () => this.onConfirmedEmail("/"),
            onSignedUp: () => this.onSignedUp("/"),
            onSignedIn: () => this.onSignedIn("/")
        };
    }

    /**
     * Called when the sign up operation completes.
     * @param url The URL to navigate to after signing up.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    private async onSignedUp(url: string): Promise<void>
    {
        const model = this.model as ISignUpModel;

        await this._identityService.authenticate(model.email!, model.password!);

        await this._historyHelper.navigate(url);
    }

    /**
     * Called when the account view has changed.
     */
    private async onViewChanged(): Promise<void>
    {
        await this._historyHelper.navigate(`/account/${this.model.view}`);
        this._historyHelper.setTitle();
    }

    /**
     * Called when the sign in operation completes.
     * @param url The URL to navigate to.
     */
    private async onSignedIn(url: string): Promise<void>
    {
        await this._historyHelper.navigate(url);
    }

    /**
     * Called when the confirm email operation completes.
     * @param url The URL to navigate to.
     */
    private async onConfirmedEmail(url: string): Promise<void>
    {
        await this._historyHelper.navigate(url);
    }
}
