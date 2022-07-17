/**
 * Represents a column in a list.
 */
export interface IColumn
{
    /**
     * The slug identifying the column.
     */
    slug: string;

    /**
     * The localized name of the column.
     */
    name: string;

    /**
     * The width of the column.
     */
    width: string;
}
