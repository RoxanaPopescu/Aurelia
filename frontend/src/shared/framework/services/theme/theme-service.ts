import { autoinject, computedFrom } from "aurelia-framework";
import { ITheme, Theme } from "./theme";
import { once } from "shared/utilities";

/**
 * Represents a function that will be called before the theme changes.
 * Use this to prepare the app for the new theme.
 * @param newTheme The new theme being set.
 * @param oldTheme The old theme, or undefined if not previously set.
 * @param finish A function that, if called, finishes the change immediately.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new theme.
 */
type ThemeChangeFunc = (newTheme: Theme, oldTheme: Theme | undefined, finish: () => void) => void | Promise<void>;

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
     * @param changeFunc The function to call before the theme changes.
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
        const resolvedThemeSlug = this.resolveThemeSlug(themeSlug);

        const theme = this._themes.find(t => t.slug === resolvedThemeSlug);

        if (theme == null)
        {
            throw new Error(`The theme '${resolvedThemeSlug}' is not supported.`);
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
        const resolvedThemeSlug = this.resolveThemeSlug(themeSlug);

        if (this._theme != null && resolvedThemeSlug === this._theme.slug)
        {
            return Promise.resolve(this._theme);
        }

        const theme = this.getTheme(resolvedThemeSlug);

        let finished = false;

        const finishFunc = () =>
        {
            if (this.theme != null && this.theme.classes.length > 0)
            {
                document.documentElement.classList.remove(...this.theme.classes);
            }

            if (theme.classes.length > 0)
            {
                document.documentElement.classList.add(...theme.classes);
            }

            this._theme = theme;

            finished = true;
        };

        await this._changeFunc(theme, this._theme, finishFunc);

        if (!finished)
        {
            finishFunc();
        }

        return this._theme;
    }

    /**
     * Resolves the specified theme slug, replacing any `{variant}` placeholder with either
     * `light` or `dark`, depending on the color scheme preference of the user agent.
     * @param themeSlug The slug identifying the theme, which may contain a placeholder.
     * @returns The slug identifying the theme.
     */
    private resolveThemeSlug(themeSlug: string): string
    {
        // Determine whether the client prefers a dark color scheme.
        const prefersDarkColorScheme = matchMedia("(prefers-color-scheme: dark)").matches;

        // Resolve the theme variant, if specified as a placeholder.
        return themeSlug.replace("{variant}", prefersDarkColorScheme ? "dark" : "light");
    }
}
