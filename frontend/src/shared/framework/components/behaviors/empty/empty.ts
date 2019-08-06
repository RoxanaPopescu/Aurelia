import { autoinject, bindable, bindingMode } from "aurelia-framework";

/**
 * Custom attribute that determines whether the element is empty.
 * Note that non-visual elements are ignored, and by default, whitespace is ignored too.
 */
@autoinject
export class EmptyCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which the attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;
    private readonly _mutationObserver = new MutationObserver(() => this.onContentChanged());

    /**
     * True if the element is empty, otherwise false.
     */
    @bindable({ primaryProperty: true, defaultBindingMode: bindingMode.fromView })
    public value: boolean;

    /**
     * True to ignore whitespace, otherwise false.
     */
    @bindable({ defaultValue: true, changeHandler: "onContentChanged" })
    public ignoreWhitespace: boolean;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this._mutationObserver.observe(this._element, { childList: true });
        this.onContentChanged();
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        this._mutationObserver.disconnect();
    }

    /**
     * Called when the child list of the element changes.
     */
    private onContentChanged(): void
    {
        const innerText = this.ignoreWhitespace
            ? this._element.innerText.trim()
            : this._element.innerText;

        this.value = this._element.children.length === 0 && innerText === "";
    }
}
