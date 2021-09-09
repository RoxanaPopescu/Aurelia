/**
 * Represents a theme.
 */
export interface ITheme
{
    /**
     * The slug identifying the theme.
     * This must match the name of the theme folder.
     */
    slug: string;

    /**
     * The name of the theme.
     */
    name: string;

    /**
     * The name of the variant of the theme, if any.
     */
    variant?: string;

    /**
     * The description of the theme, if any.
     */
    description?: string;

    /**
     * The style to use for a theme preview.
     */
    preview: IThemePreview;

    /**
     * The theme-specific class names to apply to the HTML element.
     */
    classes?: string[];

    /**
     * The names identifying the environments in which the theme should only be available,
     * or undefined if the theme should be available in all environments.
     */
    environments?: string[];

    /**
     * True if the theme has a separate logo for use on the account pages, otherwise false.
     */
    hasAccountLogo?: boolean;
}

/**
 * Represents the style to use for a theme preview.
 */
export interface IThemePreview
{
    /**
     * The primary color of the theme.
     */
    primary: string;
}

/**
 * Represents a theme.
 */
export class Theme
{
    /**
     * Creates a new instance of the type.
     * @param data The data from which the instance should be created.
     */
    public constructor(data: ITheme)
    {
        this.slug = data.slug;
        this.name = data.name;
        this.variant = data.variant;
        this.description = data.description;
        this.preview = data.preview;
        this.classes = data.classes ?? [];
        this.environments = data.environments;
        this.hasAccountLogo = data.hasAccountLogo ?? false;
    }

    /**
     * The slug identifying the theme.
     * This must match the name of the theme folder.
     */
    public readonly slug: string;

    /**
     * The name of the theme.
     */
    public readonly name: string;

    /**
     * The variant of the theme, if any.
     */
    public readonly variant: string | undefined;

    /**
     * The description of the theme, if any.
     */
    public readonly description: string | undefined;

    /**
     * The style to use for the theme preview, as RGB HEX values.
     */
    public readonly preview: IThemePreview;

    /**
     * The theme-specific class names to apply to the HTML element.
     */
    public readonly classes: string[];

    /**
     * The names identifying the environments in which the theme should only be available,
     * or undefined if the theme should be available in all environments.
     */
    public readonly environments: string[] | undefined;

    /**
     * True if the theme has a separate logo for use on the account pages, otherwise false.
     */
    public hasAccountLogo: boolean;
}
