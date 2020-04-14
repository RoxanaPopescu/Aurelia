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
     * The primary color of the theme, as an RGB HEX value.
     */
    color: string;

    /**
     * True if the theme should only be available if debugging is enabled, otherwise false.
     */
    debug?: boolean;
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
        this.color = data.color;
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
     * The primary color of the theme, as an RGB HEX value.
     */
    public readonly color: string;
}
