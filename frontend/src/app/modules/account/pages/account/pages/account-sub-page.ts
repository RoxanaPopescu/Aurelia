import { autoinject } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { AccountModel } from "app/modules/account/components/account/account";

@autoinject
export abstract class AccountSubPage
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(identityService: IdentityService, historyHelper: HistoryHelper)
    {
        this.identityService = identityService;
        this.historyHelper = historyHelper;
    }

    /**
     * The `IdentityService` instance.
     */
    protected readonly identityService: IdentityService;

    /**
     * The `HistoryHelper` instance.
     */
    protected readonly historyHelper: HistoryHelper;

    /**
     * The model for the account component.
     */
    protected model: AccountModel;

    /**
     * Called by the framework when the page is activating.
     * @param view The slug identifying the view to present in the account component.
     * @param url The value of the `url` query parameter, if relevant.
     */
    public configure(accountModel?: Partial<AccountModel>, url?: string): void
    {
        this.model =
        {
            // TODO: Choose default url based on which permissions the user has?
            onViewChanged: () => this.onViewChanged(url),
            onSignedUp: () => this.onSignedUp(url ?? "/"),
            onSignedIn: () => this.onSignedIn(url && url !== "/"
                ? this.historyHelper.getRouteUrl(`/account/choose-organization?url=${encodeURIComponent(url)}`)
                : this.historyHelper.getRouteUrl("/account/choose-organization")),
            onSignedOut: () => this.onSignedOut(url ?? "/account/sign-in"),
            onConfirmedEmail: () => this.onConfirmedEmail(url),
            onChangedPassword: () => this.onChangedPassword(url ?? "/"),
            onOrganizationCreated: () => this.onOrganizationCreated(url ?? "/account/choose-organization"),
            onChooseOrganization: () => this.onChooseOrganization(url ?? "/"),

            ...accountModel

        } as any;
    }

    /**
     * Called when the account view has changed.
     * @param urlParam The value of the `url` query parameter, if relevant.
     */
    protected async onViewChanged(urlParam?: string): Promise<void>
    {
        let url = `/account/${this.model.view}`;

        if (urlParam && ["sign-in", "sign-up", "forgot-password"].includes(this.model.view))
        {
            url += `?url=${encodeURIComponent(urlParam)}`;
        }

        await this.historyHelper.navigate(url);
    }

    /**
     * Called when the sign up operation completes.
     * @param url The URL to navigate to, if any.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async onSignedUp(url?: string): Promise<void>
    {
        if (url)
        {
            await this.historyHelper.navigate(url);
        }
    }

    /**
     * Called when the sign in operation completes.
     * @param url The URL to navigate to, if any.
     */
    protected async onSignedIn(url?: string): Promise<void>
    {
        if (url)
        {
            await this.historyHelper.navigate(url);
        }
    }

    /**
     * Called when the sign in operation completes.
     * @param url The URL to navigate to, if any.
     */
    protected async onSignedOut(url?: string): Promise<void>
    {
        if (url)
        {
            await this.historyHelper.navigate(url, { replace: true });
        }
    }

    /**
     * Called when the change password operation completes.
     * @param url The URL to navigate to, if any.
     */
    protected async onChangedPassword(url?: string): Promise<void>
    {
        if (url)
        {
            await this.historyHelper.navigate(url);
        }
    }

    /**
     * Called when the confirm email operation completes.
     * @param url The URL to navigate to, if any.
     */
    protected async onConfirmedEmail(url?: string): Promise<void>
    {
        if (url)
        {
            await this.historyHelper.navigate(url, { replace: true });
        }
    }

    /**
     * Called when the create organization operation completes.
     * @param url The URL to navigate to, if any.
     */
    private async onOrganizationCreated(url?: string): Promise<void>
    {
        if (url)
        {
            await this.historyHelper.navigate(url);
        }
    }

    /**
     * Called when the choose organization operation completes.
     * @param url The URL to navigate to.
     */
    private async onChooseOrganization(url: string): Promise<void>
    {
        if (url)
        {
            await this.historyHelper.navigate(url);
        }
    }
}
