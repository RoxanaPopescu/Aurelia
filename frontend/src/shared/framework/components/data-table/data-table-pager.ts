import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a pager for a data table.
 */
@autoinject
export class DataTablePagerCustomElement
{
    /**
     * The current page number, starting from 1.
     */
    @bindable({ defaultValue: 1 })
    public page: number;

    /**
     * The total number of pages, or undefined to apply no limits.
     */
    @bindable({ defaultValue: 1 })
    public pages: number | undefined;

    /**
     * The max number of items to show on a page, or undefined to disable this option.
     */
    @bindable({ defaultValue: 20 })
    public pageSize: number | undefined;

    /**
     * Called when one of the navigation buttons are pressed.
     * Adds the specified offset to the current page number.
     * @param offset The offset to apply to the current page.
     */
    protected onNavClick(offset: number): void
    {
        this.page += offset;
    }

    /**
     * Called when an input element receives focus.
     * Selects all content in the input.
     * @param inputElement The input element that received focus.
     */
    protected onInputFocus(inputElement: HTMLInputElement): void
    {
        inputElement.select();
    }
}
