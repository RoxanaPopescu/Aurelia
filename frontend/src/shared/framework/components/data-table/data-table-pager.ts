import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a pager for a data table.
 */
@autoinject
export class DataTablePagerCustomElement
{
    /**
     * The value of the page number input.
     */
    protected pageInputValue: string;

    /**
     * The current page number, starting from 1.
     */
    @bindable({ defaultValue: 1 })
    public page: number;

    /**
     * The total number of pages, or undefined to apply no upper limit.
     */
    @bindable
    public pages: number | undefined;

    /**
     * The max number of items to show on a page, or undefined to disable this option.
     */
    @bindable
    public pageSize: number | undefined;

    /**
     * Called by the framework when the component is binding.
     */
    protected bind(): void
    {
        this.pageChanged();
    }

    /**
     * Called by the framework when the `page` property changes.
     * Ensures the number shown in the input matches the current page number.
     */
    protected pageChanged(): void
    {
        this.pageInputValue = this.page.toString();
    }

    /**
     * Called when the page input receives focus.
     * Selects all content in the input.
     * @param event The focus event.
     */
    protected onPageInputFocus(event: FocusEvent): void
    {
        (event.target! as HTMLInputElement).select();
    }

    /**
     * Called when the page input loses focus.
     * Ensures the number shown in the input matches the current page number.
     */
    protected onPageInputBlur(): void
    {
        this.pageInputValue = this.page.toString();
    }

    /**
     * Called when a key is pressed while the input is focused.
     * If the key being pressed is `Enter`, commits the entered value.
     * @param event The keyboard event.
     */
    protected onPageInputKeydown(event: KeyboardEvent): boolean
    {
        if (event.key === "Enter")
        {
            const page = Number.parseInt(this.pageInputValue || this.page.toString());
            this.page = Math.max(1, Math.min(this.pages || page, page));
            this.pageInputValue = this.page.toString();
        }

        return true;
    }

    /**
     * Called when one of the navigation buttons are pressed.
     * Adds the specified offset to the current page number.
     * @param offset The offset to apply to the current page.
     */
    protected onNavClick(offset: number): void
    {
        this.page += offset;
    }
}
