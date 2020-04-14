import { autoinject, observable } from "aurelia-framework";
import { ITheme, ThemeService } from "shared/framework";
import { Locale, LocaleService } from "shared/localization";

/**
 * Represents a tab pane for managing the settings for the current user.
 */
@autoinject
export class SettingsPaneCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param themeService The `ThemeService` instance.
     * @param localeService The `LocaleService` instance.
     */
    public constructor(themeService: ThemeService, localeService: LocaleService)
    {
        this._themeService = themeService;
        this._localeService = localeService;
    }

    private readonly _themeService: ThemeService;
    private readonly _localeService: LocaleService;

    /**
     * The selected theme.
     */
    @observable
    protected theme: ITheme;

    /**
     * The selected locale.
     */
    @observable
    protected locale: Locale;

    /**
     * The supported themes.
     */
    protected themes: ReadonlyArray<ITheme>;

    /**
     * The supported locales.
     */
    protected locales: ReadonlyArray<Locale>;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Get the available themes.
        this.themes = this._themeService.themes;

        // Get the available locales.
        this.locales = this._localeService.locales.filter(t => !/^x-|-x-/.test(t.code));

        // Get the selected theme.
        this.theme = this._themeService.theme;

        // Get the selected locale.
        this.locale = this._localeService.locale;
    }

    protected async themeChanged(): Promise<void>
    {
        // If the theme was changed, apply the selected theme.
        // Note that this will force the app to reload.
        if (this.theme !== this._themeService.theme)
        {
            await this._themeService.setTheme(this.theme.slug);
        }
    }

    protected async localeChanged(): Promise<void>
    {
        // If the locale was changed, apply the selected locale.
        // Note that this will force the app to reload.
        if (this.locale !== this._localeService.locale)
        {
            await this._localeService.setLocale(this.locale.code);
        }
    }
}
