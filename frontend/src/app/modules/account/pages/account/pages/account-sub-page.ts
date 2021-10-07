import { autoinject } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { AccountModel } from "app/modules/account/components/account/account";
import { MapObject } from "shared/types";

// TODO: Choose default url based on which permissions the user has?
const defaultUrl = "/";

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
     * @param inviteId The value of the `inviteId` query parameter, if relevant.
     */
    public configure(accountModel?: Partial<AccountModel>, url?: string, inviteId?: string): void
    {
        this.model =
        {
            onViewChanged: () => this.onViewChanged(url, inviteId),
            onSignedUp: () => this.onSignedUp(url, inviteId),
            onSignedIn: () => this.onSignedIn(url, inviteId),
            onSignedOut: () => this.onSignedOut(url),
            onOrganizationCreated: () => this.onOrganizationCreated(url, inviteId),
            onConfirmedEmail: () => this.onConfirmedEmail(url),
            onChangedPassword: () => this.onChangedPassword(url),
            onChooseOrganization: () => this.onChooseOrganization(url),

            ...accountModel

        } as any;

        this.historyHelper.setTitle();
    }

    /**
     * Called when the account view has changed.
     * @param urlParam The value of the `url` query parameter, if relevant.
     * @param inviteId The value of the `inviteId` query parameter, if relevant.
     */
    protected async onViewChanged(urlParam?: string, inviteId?: string): Promise<void>
    {
        let url = `/account/${this.model.view}`;

        if (["sign-in", "sign-up", "forgot-password", "choose-organization", "create-organization"].includes(this.model.view))
        {
            url = this.getUrlWithQuery(url, { url: urlParam, invite: inviteId });
        }

        await this.historyHelper.navigate(url);
    }

    /**
     * Called when the sign up operation completes.
     * @param urlParam The value of the `url` query parameter, if relevant.
     * @param inviteId The value of the `inviteId` query parameter, if relevant.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async onSignedUp(urlParam?: string, inviteId?: string): Promise<void>
    {
        let url: string;

        if (this.identityService.identity?.organization == null)
        {
            url = this.getUrlWithQuery("/account/choose-organization", { url: urlParam, invite: inviteId });
        }
        else if (urlParam)
        {
            url = this.getUrlWithQuery(urlParam, { url: urlParam, invite: inviteId });
        }
        else
        {
            url = defaultUrl;
        }

        await this.historyHelper.navigate(url);
    }

    /**
     * Called when the sign in operation completes.
     * @param urlParam The value of the `url` query parameter, if relevant.
     * @param inviteId The value of the `inviteId` query parameter, if relevant.
     */
    protected async onSignedIn(urlParam?: string, inviteId?: string): Promise<void>
    {
        const url = this.getUrlWithQuery("/account/choose-organization", { url: urlParam, invite: inviteId });

        await this.historyHelper.navigate(url);
    }

    /**
     * Called when the sign in operation completes.
     * @param urlParam The value of the `url` query parameter, if relevant.
     */
    protected async onSignedOut(urlParam?: string): Promise<void>
    {
        await this.historyHelper.navigate(urlParam ?? "/account/sign-in", { replace: true });
    }

    /**
     * Called when the change password operation completes.
     * @param urlParam The value of the `url` query parameter, if relevant.
     */
    protected async onChangedPassword(urlParam?: string): Promise<void>
    {
        await this.historyHelper.navigate(urlParam ?? defaultUrl);
    }

    /**
     * Called when the confirm email operation completes.
     * @param urlParam The value of the `url` query parameter, if relevant.
     */
    protected async onConfirmedEmail(urlParam?: string): Promise<void>
    {
        if (urlParam)
        {
            await this.historyHelper.navigate(urlParam, { replace: true });
        }
    }

    /**
     * Called when the create organization operation completes.
     * @param urlParam The value of the `url` query parameter, if relevant.
     * @param inviteId The value of the `inviteId` query parameter, if relevant.
     */
    protected async onOrganizationCreated(urlParam?: string, inviteId?: string): Promise<void>
    {
        const url = this.getUrlWithQuery("/account/choose-organization", { url: urlParam, invite: inviteId });

        await this.historyHelper.navigate(url);
    }

    /**
     * Called when the choose organization operation completes.
     * @param urlParam The value of the `url` query parameter, if relevant.
     */
    protected async onChooseOrganization(urlParam?: string): Promise<void>
    {
        await this.historyHelper.navigate(urlParam ?? defaultUrl);
    }

    protected getUrlWithQuery(url: string, query: MapObject<string | undefined>): string
    {
        const params: string[] = [];

        for (const key of Object.keys(query))
        {
            if (query[key])
            {
                params.push(`${key}=${encodeURIComponent(query[key]!)}`);
            }
        }

        if (params.length > 0)
        {
            const parts = url.split("#", 2);

            return `${parts[0]}${parts[0].includes("?") ? "&" : "?"}${params.join("&")}${parts[1] ?? ""}`;
        }

        return url;
    }
}
