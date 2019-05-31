/**
 * Represents the direction in which to sort.
 */
export type SortingDirection = "ascending" | "descending";

/**
 * Represents the sorting options to use for an API request.
 */
export interface ISorting
{
    /**
     * The name of the property by which the items should be sorted.
     */
    property: string;

    /**
     * The direction in which the items should be sorted.
     */
    direction: SortingDirection;
}
