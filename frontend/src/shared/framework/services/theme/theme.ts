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
}
