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
     * The localized short name of the column, suitable for use in a table header.
     */
    shortName: string;

    /**
     * The width of the column.
     */
    width: string;

    /**
     * The property to use for sorting.
     */
    property: string | undefined;

    /**
     * True if the column is hidden, e.g. because it represents an icon, otherwise false.
     */
    hidden: boolean;

    /**
     * Gets the data representing this instance.
     */
    toJSON(): any
}
