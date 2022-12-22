import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { IUrlInfo } from "shared/types";
import { Id } from "shared/utilities";
import { AutocompleteHint, EnterKeyHint } from "../input";

/**
 * Custom element representing an list of URL inputs.
 */
@autoinject
export class UrlsInputCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;

    /**
     * The unique ID of the control.
     */
    protected id = Id.sequential();

    // TODO:4: In other inputs, the value is immutable, but here we mutate the array and properties of its items.
    /**
     * The value of the input, or undefined if the input is empty.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: IUrlInfo[] | undefined;

    /**
     * True if the input is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * True if the input is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;

    /**
     * The autocomplete mode to use.
     */
    @bindable({ defaultValue: "off" })
    public autocomplete: AutocompleteHint;

    /**
     * True to select the contents when the input is focused, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autoselect: boolean;

    /**
     * The hint indicating the type of `Enter` key to show on a virtual keyboard,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

    /**
     * The max length of the value, or undefined to use the max supported length.
     */
    @bindable({ defaultValue: undefined })
    public maxlength: number | undefined;

    /**
     * Called when an `async-validator` associated with the input runs.
     * Determines whether the value contains any empty links.
     * @returns True if validation succeeded, otherwise false.
     */
    protected validateNoEmptyLinks(): boolean
    {
        return this.value == null || !this.value.some(link => !link.url);
    }

    /**
     * Called when an `async-validator` associated with the input runs.
     * Determines whether the value contains any duplicate links.
     * @returns True if validation succeeded, otherwise false.
     */
    protected validateNoDuplicateLinks(): boolean
    {
        const links = this.value?.filter(link => link.url);

        return links == null || links.length === 0 || links.length === new Set(links.map(link => link.url)).size;
    }

    /**
     * Called when the `Remove link` icon is clicked on a link.
     * @param index The index of the link to remove.
     */
    protected onDeleteClick(index: number): void
    {
        if (this.value!.length > 1)
        {
            this.value!.splice(index, 1);
        }
        else
        {
            this.value = undefined;
        }

        // Dispatch the `input` event to indicate that the comitted value, has changed.
        this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

        // Dispatch the `change` event to indicate that the comitted value, has changed.
        this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
    }

    /**
     * Called when the `Add link` icon is clicked.
     */
    protected onAddClick(): void
    {
        if (this.value != null)
        {
            this.value.push({ url: undefined });
        }
        else
        {
            this.value = [{ url: undefined }];
        }

        // Dispatch the `input` event to indicate that the comitted value, has changed.
        this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

        // Dispatch the `change` event to indicate that the comitted value, has changed.
        this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
    }
}
