import clone from "clone";
import { autoinject, computedFrom } from "aurelia-framework";
import { ListViewDefinition, OrderListViewFilter } from "app/model/list-view";
import { IListViewFilterCriterion } from "app/model/list-view/entities/list-view-filter-criterion";

export type OrderFiltersPanelView = "active-filters" | "add-filter" | "edit-filter";
/**
 * Represents the model for a `OrderFiltersPanel` instance.
 */
export interface IOrderFiltersPanelModel
{
    /**
     * The list view definition.
     */
    definition: ListViewDefinition<OrderListViewFilter>;
}

/**
 * Represents a modal panel for selecting and ordering the columns that should be presented in a list.
 */
@autoinject
export class OrderFiltersPanel
{
    /**
     * The model for the modal.
     */
    protected model: ListViewDefinition<OrderListViewFilter>;

    /**
     * The slug identifying the view that was previously presented.
     */
    protected previousView: OrderFiltersPanelView | undefined;

    /**
     * The slug identifying the view to present.
     */
    protected view: OrderFiltersPanelView;

    /**
     * The filter criterion currently being edited, if any.
     */
    protected criterion: IListViewFilterCriterion | undefined;

    /**
     * The query text entered in the filter inpur in the `add-filter` view, if any.
     */
    protected queryText: string | undefined;

    /**
     * The filtered list of available criteria.
     */
    @computedFrom("queryText")
    protected get filteredCriteria(): IListViewFilterCriterion[]
    {
        if (this.queryText)
        {
            return this.model.filter.criteria.filter(c => c.name.toLowerCase().includes(this.queryText!.toLowerCase()));
        }

        return this.model.filter.criteria;
    }

    //#region "Filter specific properties"

    //#endregion

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: IOrderFiltersPanelModel): void
    {
        this.model = model.definition;
        this.view = this.model.filter.criteria.some(c => c.summary != null) ? "active-filters" : "add-filter";
    }

    /**
     * Called when the `Filters` breadcrumb in the panel title is clicked.
     */
    protected onBackToActiveFiltersClick(): void
    {
        this.setView("active-filters");
    }

    /**
     * Called when the `Add` breadcrumb in the panel title is clicked.
     */
    protected onBackToAddFilterClick(): void
    {
        this.setView("add-filter");
    }

    /**
     * Called when the `Reset` icon in the panel is clicked.
     */
    protected onResetClick(): void
    {
        for (const criterion of this.model.filter.criteria)
        {
            criterion.clear();
        }
    }

    /**
     * Called when the `Add filter` button in the `active-filters` view is clicked.
     */
    protected onAddFilterClick(): void
    {
        this.setView("add-filter");
    }

    /**
     * Called when a `Remove filter` icon in the `active-filters` view is clicked.
     * @returns False to prevent default.
     */
    protected onRemoveFilterClick(criterion: IListViewFilterCriterion): boolean
    {
        criterion.clear();

        return false;
    }

    /**
     * Called when a filter is chosen in the `active-filters` or `add-filter` view.
     * @param criterion The filter criterion that was chosen.
     */
    protected onChooseFilter(criterion: IListViewFilterCriterion): void
    {
        this.criterion = clone(criterion);

        this.setView("edit-filter");
    }

    /**
     * Called when the `Apply` button in the `edit-filter` view is clicked.
     */
    protected onApplyFilterClick(): void
    {
        Object.assign(this.model.filter, this.criterion!.model);

        this.setView("active-filters");
    }

    //#region "Filter specific methods"

    //#endregion

    /**
     * Presents the specified view.
     * @param view The slug identifying the view to present.
     */
    private setView(view: OrderFiltersPanelView): void
    {
        this.previousView = this.view;
        this.view = view;

        if (view !== "edit-filter")
        {
            this.criterion = undefined;
        }
    }
}
