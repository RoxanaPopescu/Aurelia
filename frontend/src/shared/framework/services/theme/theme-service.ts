import { autoinject, computedFrom } from "aurelia-framework";
import { ITheme, Theme } from "./theme";
import { once } from "shared/utilities";

/**
 * Represents a function that will be invoked before the theme changes.
 * Use this to prepare the app for the new theme.
 * @param newTheme The new theme being set.
 * @param oldTheme The old theme, or undefined if not previously set.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new theme.
 */
type ThemeChangeFunc = (newTheme: Theme, oldTheme: Theme | undefined) => void | Promise<void>;

/**
 * Represents a service that manages themes.
 */
@autoinject
export class ThemeService
{
    private _themes: Theme[];
    private _theme: Theme;
    private _changeFunc: ThemeChangeFunc;

    /**
     * Gets the supported themes.
     */
    @computedFrom("_themes")
    public get themes(): ReadonlyArray<Theme>
    {
        return this._themes;
    }

    /**
     * Gets the current theme.
     */
    @computedFrom("_theme")
    public get theme(): Theme
    {
        return this._theme;
    }

    /**
     * Configures the instance.
     * @param themes The themes supported by the app.
     * @param themeFolderPath The path for the folder containing the themes.
     * @param changeFunc The function that is invoked before the theme changes.
     */
    @once
    public configure(themes: ITheme[], changeFunc: ThemeChangeFunc): void
    {
        this._themes = themes.filter(t => ENVIRONMENT.debug || !t.debug).map(t => new Theme(t));

        this._changeFunc = changeFunc;
    }

    /**
     * Gets the theme with the specified slug.
     * @param themeSlug The slug iddentifying the theme.
     * @returns The theme with the specified slug.
     */
    public getTheme(themeSlug: string): Theme
    {
        const theme = this._themes.find(t => t.slug === themeSlug);

        if (theme == null)
        {
            throw new Error(`The theme '${themeSlug}' is not supported.`);
        }

        return theme;
    }

    /**
     * Sets the current theme.
     * @param themeSlug The slug identifying the theme.
     * @returns A promise that will be resolved with the `Theme` instance when the new theme is loaded.
     */
    public async setTheme(themeSlug: string): Promise<Theme>
    {
        if (this._theme != null && themeSlug === this._theme.slug)
        {
            return Promise.resolve(this._theme);
        }

        const theme = this.getTheme(themeSlug);

        await this._changeFunc(theme, this._theme);

        this._theme = theme;

        return this._theme;
    }
}
