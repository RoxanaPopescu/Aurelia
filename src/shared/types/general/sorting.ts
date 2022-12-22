/**
 * Represents the direction in which to sort.
 */
export type SortingDirection = "ascending" | "descending";

/**
 * Represents the sorting options to use for an API request.
 */
export interface ISorting<TProperty = string>
{
    /**
     * The name of the property by which the items should be sorted.
     */
    property: TProperty;

    /**
     * The direction in which the items should be sorted.
     */
    direction: SortingDirection;
}
