import { MapObject } from "shared/types";

/**
 * Represents a criterion in a filter for a list view
 */
export interface IListViewFilterCriterion
{
    /**
     * The slug identifying the filter criterion.
     */
    slug: string;

    /**
     * The localized name of the filter criterion.
     */
    name: string;

    /**
     * The localized description of the filter criterion.
     */
    description: string;

    /**
     * The model representing the current state of the filter criterion.
     */
    model: MapObject;

    /**
     * The function that, when called, will clear the filter.
     */
    clear: () => void;

    /**
     * The localized summary describing the criterion, if active,
     * or undefined if the criterion is not active.
     */
    summary: string[] | undefined;
}
