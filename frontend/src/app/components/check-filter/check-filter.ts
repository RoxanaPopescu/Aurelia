import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { CheckFilterItemCustomElement } from "./check-filter-item";

/**
 * Custom element representing a filter with check toggles
 * and a search input, allowing the user to find and select
 * one or more items.
 */
@autoinject
export class CheckFilterCustomElement<TModel = any>
{
    /**
     * The element representing the input.
     */
    protected inputElement: HTMLElement;

    /**
     * The element into which items will be projected.
     */
    protected itemsElement: HTMLElement;

    /**
     * True if the filter contains no visible items, otherwise false.
     */
    protected empty = true;

    /**
     * Gets the selected state of the item.
     */
    @computedFrom("showAll", "filterValue", "items.lenght", "value.length")
    public get showAllVisible(): boolean
    {
        const visibleItemCount = this.items.filter(i => i.visible === true).length;
        const hiddenItemCount = this.items.filter(i => i.visible === false).length;

        return visibleItemCount > this.limit || hiddenItemCount > 0;
    }

    /**
     * The values of the picked items, or undefined if no item have been picked.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: TModel[] = [];

    /**
     * The text entered in the filter input, or undefined if no text is entered.
     */
    @bindable({ defaultValue: undefined })
    public filterValue: string | undefined;
    /**
     * The number of items to show by default, or undefined to apply no limit.
     */
    @bindable({ defaultValue: 5 })
    public limit: number;

    /**
     * The items attached to the filter.
     */
    public items: CheckFilterItemCustomElement<TModel>[] = [];

    /**
     * True to show all items, otherwise false.
     */
    public showAll = false;

    /**
     * Called when a child item is attached.
     * Updates the collection of attached items to match the items present in the DOM.
     * This approach is needed, because we cannot rely on the order in which items are attached.
     */
    public attachItem(): void
    {
        const newItems: CheckFilterItemCustomElement<TModel>[] = [];

        // Find all descendent elements of type `item`.
        const itemElements = this.itemsElement.querySelectorAll("check-filter-item");

        // Iterate through the elements, in the order they appear in the DOM.
        itemElements.forEach((itemElement: any) =>
        {
            // Does the element have an `Aurelia` controller?
            if (itemElement.au != null && itemElement.au.controller != null)
            {
                const itemViewModel = itemElement.au.controller.viewModel;

                // Add the view model to the new list of items.
                newItems.push(itemViewModel);
            }
        });

        // Replace the list of items.
        this.items = newItems;

        // Update the `empty` state.
        this.empty = !this.items.some(i => i.visible);
    }

    /**
     * Called when a child item is detached.
     * Removes the item as a child of this to show all items item to detach.
     */
    public detachItem(item: CheckFilterItemCustomElement<TModel>): void
    {
        // Find the item in the list of items.
        const index = this.items.indexOf(item);

        // Remove the item from the list of items.
        this.items.splice(index, 1);

        // Update the `empty` state.
        this.empty = !this.items.some(i => i.visible);
    }

    /**
     * Selects the item representing the specified value.
     * @param value The value represented by the item to select.
     */
    public selectItem(value: TModel): void
    {
        // Set the value.
        this.value = [...this.value, value];

        // Focus the input element.
        this.inputElement.focus();
    }

    /**
     * Deselects the item representing the specified value.
     * @param value The value represented by the item to select.
     */
    public deselectItem(value: TModel): void
    {
        // Try to find the item in the list of items.
        const index = this.value.indexOf(value);

        // Do nothing if the item was not found.
        if (index > -1)
        {
            // Remove the item from the list of items.
            const newValue = this.value.slice();
            newValue.splice(index, 1);
            this.value = newValue;
        }

        // Focus the input element.
        this.inputElement.focus();
    }

    /**
     * Called when the `Reset` button is clicked.
     * Deselects all items and clears the filter input.
     */
    protected resetClick(): void
    {
        this.value = [];
        this.empty = this.items.length === 0;

        // Focus the input element.
        this.inputElement.focus();
    }

    /**
     * Called by the framework when the `filterValue` property changes.
     * Updates the `empty` state to match the visibility of the items.
     */
    protected filterValueChanged(): void
    {
        this.empty = !this.items.some(i => i.visible);
    }
}
