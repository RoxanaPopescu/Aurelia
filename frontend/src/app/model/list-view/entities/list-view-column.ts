/**
 * Represents a column in a list view.
 */
export interface IListViewColumn
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

    /**
     * The property to use for sorting.
     */
    property: string | undefined;

    /**
     * Gets the data representing this instance.
     */
    toJSON(): any
}
