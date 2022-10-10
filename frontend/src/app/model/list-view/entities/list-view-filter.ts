import { computedFrom } from "aurelia-framework";
import { AnyPropertyChangedHandler } from "shared/types";
import { IListViewFilterCriterion } from "./list-view-filter-criterion";

/**
 * Represents a filter for a list view.
 */
export abstract class ListViewFilter
{
    /**
     * The criteria represented by the filter, each with a summary of its state.
     */
    public criteria: IListViewFilterCriterion[];

    /**
     * The criteria represented by the filter, each with a summary of its state.
     */
    @computedFrom("criteria")
    public get activeCriteria(): IListViewFilterCriterion[]
    {
        return this.criteria.filter(c => c.summary != null);
    }

    /**
     * Called by the framework when an observable property changes.
     * Note that this will be assigned by the `ListView` instance.
     */
    public update: AnyPropertyChangedHandler | undefined;

    /**
     * Called by the `ListView` instance when criteria needs to be recomputed.
     */
    public abstract updateCriteria(): void;

    /**
     * Gets the data representing this instance.
     */
    public abstract toJSON(): any;
}
