import { autoinject, bindable, computedFrom, bindingMode, observable } from "aurelia-framework";
import { IPaging } from "shared/types";

/**
 * Represents a pager for a data table.
 */
@autoinject
export class DataTablePagerCustomElement
{
    /**
     * The value of the page number input element.
     */
    protected pageNumber: number = 1;

    /**
     * The value of the page size input element.
     */
    @observable
    protected pageSize: number = 10;

    /**
     * The total number of pages, or undefined if unknown.
     * This is computed from `listSize` and `value.pageSize`, with `pageCount` used as fallback.
     */
    @computedFrom("listSize", "value.pageSize", "pageCount")
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
    @bindable({ defaultValue: [10, 20, 30, 40, 50, 100] })
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
     * Called when the page input loses focus.
     * Ensures the number shown in the input matches the current page number.
     */
    protected onPageInputFocusOut(): void
    {
        this.pageNumber = this.value.page;
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
            const page = this.pageNumber || this.value.page;
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
    protected pageSizeChanged(): void
    {
        this.value =
        {
            ...this.value,
            pageSize: this.pageSize
        };
    }

    /**
     * Called when the value is changed.
     * Sets the value of the page number input.
     */
    protected valueChanged(): void
    {
        this.pageNumber = this.value.page;
        this.pageSize = this.value.pageSize;
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
