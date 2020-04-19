import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { CheckFilterCustomElement } from "./check-filter";

/**
 * Custom element representing an item in a `check-filter`.
 */
@autoinject
export class CheckFilterItemCustomElement<TModel = any>
{
    /**
     * Creates a new instance of the class.
     * @param element The element representing the component.
     */
    public constructor(element: Element, checkFilter: CheckFilterCustomElement)
    {
        this._element = element as HTMLElement;
        this._checkFilter = checkFilter;
    }

    private readonly _element: HTMLElement;
    private readonly _checkFilter: CheckFilterCustomElement;

    /**
     * Gets the selected state of the item.
     */
    @computedFrom("_checkFilter.value.length")
    public get selected(): boolean
    {
        return this._checkFilter.value.includes(this.model);
    }

    /**
     * Sets the selected state of the item.
     */
    public set selected(value: boolean)
    {
        if (value)
        {
            this._checkFilter.selectItem(this.model);
        }
        else
        {
            this._checkFilter.deselectItem(this.model);
        }
    }

    /**
     * The value associated with the element.
     */
    @bindable
    public model: TModel;

    /**
     * True if this item should be visible, false if it should be hidden due to filtering.
     */
    @computedFrom("_checkFilter.limit", "_checkFilter.showAll", "_checkFilter.items.length", "_checkFilter.value.length", "_checkFilter.filterValue")
    public get visible(): boolean | null
    {
        if (this._checkFilter != null)
        {
            if (this._checkFilter.filterValue && !this.contains(this._checkFilter.filterValue))
            {
                return null;
            }

            if (!this._checkFilter.showAll)
            {
                const limit = this._checkFilter.limit || Number.MAX_SAFE_INTEGER;

                if (this._checkFilter.value.length < limit)
                {
                    const matchingUnselectedItems = this._checkFilter.items.filter(i =>
                        !i.selected && (!this._checkFilter.filterValue || i.contains(this._checkFilter.filterValue)));

                    return matchingUnselectedItems.indexOf(this) < limit - this._checkFilter.value.length;
                }

                return this.selected;
            }
        }

        return true;
    }

    /**
     * Called by the framework when the component is detached.
     * Detaches the item from the item picker.
     */
    public attached(): void
    {
        this._checkFilter.attachItem();
    }

    /**
     * Called by the framework when the component is detached.
     * Detaches the item from the item picker.
     */
    public detached(): void
    {
        this._checkFilter.detachItem(this);
    }

    /**
     * Queries the DOM for the item, to determine whether it includes the specified text.
     * Note that the comparison is case insensitive, and that any whitespace is collapsed to a single space.
     * @param text The text to look for in the item.
     * @returns True if the item contains the specified text, otherwise false.
     */
    public contains(text: string): boolean
    {
        const elements: Element[] = [this._element];

        let innerText = "";

        while (elements.length > 0)
        {
            const element = elements.shift()!;

            if (element.textContent)
            {
                innerText += ` ${element.textContent}`;
            }

            elements.push(...Array.from(element.children));
        }

        const searchText = text.replace(/([^\w]|_)+/g, " ").trim().toLowerCase();
        innerText = innerText.replace(/([^\w]|_)+/g, " ").trim().toLowerCase();

        return innerText.includes(searchText);
    }
}
