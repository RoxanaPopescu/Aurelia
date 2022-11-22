import { autoinject } from "aurelia-framework";
import { Log, HistoryHelper } from "shared/infrastructure";
import { Modal, ModalService, ThemeService, ITheme, IValidation, ModalCloseReason } from "shared/framework";
import { LocaleService, Locale, CurrencyService, Currency } from "shared/localization";
import { IdentityService } from "app/services/identity";
import { ProfileService, Profile } from "app/services/profile";
import { AccountService } from "../../services/account";
import { AccountDeleteModalDialog } from "./modals/account-delete/account-delete";
import { Operation } from "shared/utilities";
import { OrganizationService, OrganizationInfo } from "app/model/organization";
import { Host } from "app/types/host";

/**
 * Represents the global `account` modal panel.
 * This allows the user to manage profile and account settings.
 */
@autoinject
export class AccountModalPanel
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param modalService The `ModalService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param identityService The `IdentityService` instance.
     * @param accountService The `AccountService` instance.
     * @param profileService The `ProfileService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param localeService The `LocaleService` instance.
     * @param currencyService The `CurrencyService` instance.
     * @param themeService The `ThemeService` instance.
     * @param host The `Host` instance.
     */
    public constructor(
        modal: Modal,
        modalService: ModalService,
        historyHelper: HistoryHelper,
        identityService: IdentityService,
        accountService: AccountService,
        profileService: ProfileService,
        organizationService: OrganizationService,
        localeService: LocaleService,
        currencyService: CurrencyService,
        themeService: ThemeService,
        host: Host)
    {
        this._modal = modal;
        this._modalService = modalService;
        this._historyHelper = historyHelper;
        this._identityService = identityService;
        this._accountService = accountService;
        this._profileService = profileService;
        this._organizationService = organizationService;
        this._localeService = localeService;
        this._currencyService = currencyService;
        this._themeService = themeService;
        this._host = host;
    }

    private readonly _modal: Modal;
    private readonly _modalService: ModalService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _identityService: IdentityService;
    private readonly _accountService: AccountService;
    private readonly _profileService: ProfileService;
    private readonly _organizationService: OrganizationService;
    private readonly _localeService: LocaleService;
    private readonly _currencyService: CurrencyService;
    private readonly _themeService: ThemeService;
    private readonly _host: Host;
    private _profile: Profile;
    private _result: boolean | undefined;

    /**
     * The position of the panel.
     */
    protected position = document.documentElement.classList.contains("theme-enable-topbar") ? 'right' : 'left';

    /**
     * The name of the selected tab.
     */
    protected selectedTab: "profile" | "settings" | "security" = "profile";

    /**
     * The new password, if specified.
     */
    protected newPassword: string | undefined;

    /**
     * The model representing the profile for the current user.
     */
    protected settingsModel: Partial<Profile>;

    /**
     * The supported locales.
     */
    protected locales: ReadonlyArray<Locale>;

    /**
     * The selected locale.
     */
    protected locale: Locale;

    /**
     * The supported currencies.
     */
    protected currencies: ReadonlyArray<Currency>;

    /**
     * The selected currency.
     */
    protected currency: Currency;

    /**
     * The supported themes.
     */
    protected themes: ReadonlyArray<ITheme>;

    /**
     * The selected theme.
     */
    protected theme: ITheme;

    /**
     * The organizations associated with the user.
     */
    protected organizations: OrganizationInfo[];

    /**
     * The selected organization.
     */
    protected organization: OrganizationInfo;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activating.
     */
    public async activate(): Promise<void>
    {
        if (this._identityService.identity == null)
        {
            throw new Error("Cannot show panel when the user is not authenticated.");
        }

        // Get the available locales.
        this.locales = this._localeService.locales;

        // Get the selected locale.
        this.locale = this._localeService.locale;

        // Get the available currencies.
        this.currencies = this._currencyService.currencies;

        // Get the selected currency.
        this.currency = this._currencyService.currency;

        // Get the available themes.

        // HACK: In the production environment, hide themes associated with other hosts.
        this.themes = this._themeService.themes.filter(theme =>
            !theme.isHostSpecific ||
            this._host.theme === undefined ||
            theme.slug === this._host.theme ||
            theme.slug.startsWith(this._host.theme.replace(/{variant}$/, "")));

        // Get the selected theme.
        this.theme = this._themeService.theme;

        // Get the profile for the current user.
        this._profile = await this._profileService.get();
        this.settingsModel = this._profile.getSettings();

        // Get the list of organizations for the current user.
        // tslint:disable-next-line: no-unused-expression
        new Operation(async () =>
        {
            this.organizations = (await this._organizationService.getAll()).sort((a, b) => a.name.localeCompare(b.name));
            this.organization = this.organizations.find(o => o.id === this._identityService.identity!.organization!.id)!;
        });
    }

    /**
     * Called by the framework when the modal is deactivating.
     * @param reason The reason for closing the modal.
     * @returns A promise that will be resolved with true if the settings were saved
     * or the account was deleted, otherwise false.
     */
    public async deactivate(reason?: ModalCloseReason): Promise<boolean>
    {
        if (this._modal.busy === true)
        {
            // tslint:disable-next-line: no-string-throw
            throw "Cannot close while busy.";
        }

        if (reason === "discard-changes")
        {
            return true;
        }

        // Save changes before the modal closes?
        if (this._result == undefined)
        {
            await this.saveChanges();
        }

        if (!this._result)
        {
            // tslint:disable-next-line: no-string-throw
            throw "Cannot close without saving changes.";
        }

        return true;
    }

    /**
     * Called when the `Delete account` button is pressed.
     * Asks for confirmation, then deletes the account.
     */
    protected async onDeleteClick(): Promise<void>
    {
        // Show modal dialog asking for confirmation.
        const confirmed = await this._modalService.open(AccountDeleteModalDialog).promise;

        // Abort if the user did not confirm.
        if (!confirmed)
        {
            return;
        }

        try
        {
            // Indicate that the modal is busy.
            this._modal.busy = true;

            // Delete the account.
            await this._accountService.delete(this._identityService.identity!.email);

            // Indicate that the operation succeeded.
            this._result = true;

            // Indicate that the modal is ready.
            this._modal.busy = null;
        }
        catch (error)
        {
            // Indicate that the operation failed.
            this._result = undefined;

            Log.error("Failed to delete the account.", error);

            // Indicate that the modal is ready.
            this._modal.busy = false;
        }

        // If the account was deleted, sign out.
        if (this._result)
        {
            await this._historyHelper.navigate("/account/sign-out");
        }
    }

    /**
     * Called when the `Sign out` button is pressed.
     * Saves changes, then signs the user out.
     */
    protected async onSignOutClick(): Promise<void>
    {
        // Save any changes made to the profile, then sign out.
        await this.saveChanges(true, undefined);
    }

    /**
     * Called when the user select an organization from the `Sign-out` menu.
     * Saves changes, then signs the user out of the current organization, and in to the specified organization.
     * @param organization The organization that was selected.
     */
    protected async onOrganizationSelect(organization: OrganizationInfo): Promise<void>
    {
        // Save any changes made to the profile, then reload the app with the new organization.
        await this.saveChanges(false, organization.id);
    }

    /**
     * Saves the changes made to the settings.
     * @param shouldSignOut True to sign the user out, once changes have been saved.
     * @param newOrganizationId The ID of the organization to switch to, once changes have been saved.
     */
    private async saveChanges(shouldSignOut?: boolean, newOrganizationId?: string): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            // Indicate that the modal is busy.
            this._modal.busy = true;

            // Store the current locale code, currency code and theme slug in the settings.
            this.settingsModel.settings!.localeCode = this.locale.code;
            this.settingsModel.settings!.currencyCode = this.currency.code;
            this.settingsModel.settings!.themeSlug = this.theme.slug;

            // Saves the users profile.
            await this._profileService.save(this.settingsModel);

            // Apply the settings to the profile.
            this._profile.setSettings(this.settingsModel);

            // If a new password was specified, change the users password.
            if (this.newPassword)
            {
                await this._accountService.changePasswordUsingCurrentPassword(this.settingsModel.currentPassword!, this.newPassword);
            }

            if (!shouldSignOut)
            {
                // Reauthenticate to ensure we get the updated identity.
                const reauthorized = await this._identityService.reauthorize();

                if (!reauthorized)
                {
                    // Indicate that the operation failed.
                    this._result = undefined;

                    Log.error("Failed to reauthorize.");

                    // Indicate that the modal is ready.
                    this._modal.busy = false;

                    return;
                }
            }

            const changePromises: Promise<any>[] = [];

            // If the locale was changed, apply the selected locale.
            // Note that this will force the app to reload.
            if (this.locale !== this._localeService.locale)
            {
                changePromises.push(this._localeService.setLocale(this.locale.code));
            }

            // If the currency was changed, apply the selected currency.
            if (this.currency !== this._currencyService.currency)
            {
                changePromises.push(this._currencyService.setCurrency(this.currency.code));
            }

            // If the theme was changed, apply the selected theme.
            // Note that this will force the app to reload.
            if (this.theme !== this._themeService.theme)
            {
                changePromises.push(this._themeService.setTheme(this.theme.slug));
            }

            // If needed, wait for the app to reload.
            await Promise.all(changePromises);

            // Indicate that the operation succeeded.
            this._result = true;

            if (newOrganizationId == null)
            {
                // Indicate that the modal is ready.
                this._modal.busy = null;
            }
        }
        catch (error)
        {
            // Indicate that the operation failed.
            this._result = undefined;

            Log.error("Failed to save the profile.", error);

            // Indicate that the modal is ready.
            this._modal.busy = false;
        }

        if (this._result === true)
        {
            if (shouldSignOut)
            {
                await this._historyHelper.navigate("/account/sign-out");
            }
            else if (newOrganizationId != null)
            {
                // Authorize for the specified organization.
                const success = await this._identityService.authorize(newOrganizationId);

                if (success)
                {
                    // Reload the app.
                    location.reload();
                }
            }
        }
    }
}
