import { autoinject } from "aurelia-framework";
import { ITheme } from "./theme";
import { once } from "shared/utilities";

/**
 * Represents a function that will be called before the theme changes.
 * Use this to preparing the app for the new theme.
 * @param newTheme The new theme being set.
 * @param oldTheme The old theme, or undefined if not previously set.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new theme.
 */
type ThemeChangeFunc = (newTheme: ITheme | undefined, oldTheme: ITheme) => void | Promise<void>;

/**
 * Represents a service that manages themes.
 */
@autoinject
export class ThemeService
{
    private _themes: ITheme[];
    private _theme: ITheme;
    private _changeFunc: ThemeChangeFunc;

    /**
     * Gets the supported themes.
     */
    public get themes(): ReadonlyArray<ITheme>
    {
        return this._themes;
    }

    /**
     * Gets the current theme.
     */
    public get theme(): ITheme
    {
        return this._theme;
    }

    /**
     * Configures the instance.
     * @param themes The themes supported by the app.
     * @param themeFolderPath The path for the folder containing the themes.
     * @param changeFunc The function that is invoked when setting the theme.
     */
    @once
    public configure(themes: ITheme[], changeFunc: ThemeChangeFunc): void
    {
        this._themes = themes;
        this._changeFunc = changeFunc;
    }

    /**
     * Gets the theme with the specified slug.
     * @param themeSlug The slug iddentifying the theme.
     * @returns The theme with the specified slug.
     */
    public getTheme(themeSlug: string): ITheme
    {
        const theme = this._themes.find(l => l.slug === themeSlug);

        if (theme == null)
        {
            throw new Error(`The theme '${themeSlug}' is not supported.`);
        }

        return theme;
    }

    /**
     * Sets the current theme.
     * @param themeSlug The slug identifying the theme.
     * @returns A promise that will be resolved with the `ITheme` instance when the new theme is loaded.
     */
    public async setTheme(themeSlug: string): Promise<ITheme>
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
