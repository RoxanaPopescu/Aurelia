import { autoinject, bindable, computedFrom, bindingMode } from "aurelia-framework";
import { IPaging } from "shared/types";

/**
 * Represents a pager for a data table.
 */
@autoinject
export class DataTablePagerCustomElement
{
    /**
     * The page number input element.
     */
    protected pageInputElement: HTMLInputElement;

    /**
     * The page size select element.
     */
    protected pageSizeSelectElement: HTMLInputElement;

    /**
     * The total number of pages, or undefined if unknown.
     * This is computed from `listSize` and `pageSize`, with `pageCount` used as fallback.
     */
    @computedFrom("listSize", "model.pageSize", "pageCount")
    protected get computedPageCount(): number | undefined
    {
        if (this.value == null)
        {
            return undefined;
        }

        if (this.listSize == null || this.value.pageSize == null)
        {
            return this.pageCount;
        }

        return Math.ceil(this.listSize / this.value.pageSize);
    }

    /**
     * The model representing the current state of the pager.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: IPaging;

    /**
     * The page sizes the user may choose from.
     */
    @bindable({ defaultValue: [10, 20, 30, 40, 50] })
    public pageSizes: number[];

    /**
     * The total number of items in the list, or undefined if unknown.
     */
    @bindable
    public listSize: number | undefined;

    /**
     * The total number of pages, used as fallback if `listSize` or `pageSize` is undefined,
     * or undefined to to fall back to unlimited paging.
     */
    @bindable
    public pageCount: number | undefined;

    /**
     * True if disabled, e.g. while loading data, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * Called when the page input receives focus.
     * Selects all content in the input.
     */
    protected onPageInputFocus(): void
    {
        setTimeout(() => this.pageInputElement.setSelectionRange(0, this.pageInputElement.value.length));
    }

    /**
     * Called when the page input loses focus.
     * Ensures the number shown in the input matches the current page number.
     */
    protected onPageInputBlur(): void
    {
        this.pageInputElement.valueAsNumber = this.value.page;
    }

    /**
     * Called when a key is pressed while the input is focused.
     * If the key being pressed is `Enter`, commits the change.
     * @param event The keyboard event.
     */
    protected onPageInputKeydown(event: KeyboardEvent): boolean
    {
        if (event.key === "Enter")
        {
            const page = this.pageInputElement.valueAsNumber || this.value.page;
            this.value =
            {
                ...this.value,
                page: Math.max(1, this.computedPageCount == null ? page : Math.min(this.computedPageCount, page))
            };
        }

        return true;
    }

    /**
     * Called when the page size is changed.
     * Sets the page size and commits the change.
     */
    protected onPageSizeChange(): void
    {
        this.value =
        {
            ...this.value,
            pageSize: parseInt(this.pageSizeSelectElement.value)
        };
    }

    /**
     * Called when one of the navigation buttons are pressed.
     * Adds the specified offset to the current page number and commits the change.
     * @param offset The offset to apply to the current page.
     */
    protected onNavClick(offset: number): void
    {
        this.value =
        {
            ...this.value,
            page: this.value.page + offset
        };
    }
}
