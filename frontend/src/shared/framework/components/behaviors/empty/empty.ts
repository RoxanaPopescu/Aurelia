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
    private readonly _childListMutationObserver = new MutationObserver(mutations => this.onChildListChanged(mutations));
    private readonly _textNodeMutationObserver = new MutationObserver(mutations => this.onContentChanged());

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
        this._childListMutationObserver.observe(this._element, { childList: true, characterData: true });

        this.onContentChanged();

        this._element.childNodes.forEach(node =>
        {
            if (node.nodeType === 3)
            {
                this._textNodeMutationObserver.observe(node, { characterData: true });
            }
        });
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        this._childListMutationObserver.disconnect();
        this._textNodeMutationObserver.disconnect();
    }

    /**
     * Called when the child list of the element changes.
     * @param mutations The mutation records.
     */
    private onChildListChanged(mutations: MutationRecord[]): void
    {
        this.onContentChanged();

        for (const mutation of mutations)
        {
            mutation.removedNodes.forEach(node =>
            {
                if (node.nodeType === 3)
                {
                    this._textNodeMutationObserver.disconnect();
                }
            });
        }

        for (const mutation of mutations)
        {
            mutation.addedNodes.forEach(node =>
            {
                if (node.nodeType === 3)
                {
                    this._textNodeMutationObserver.observe(node, { characterData: true });
                }
            });
        }
    }

    /**
     * Called when the text in a child node of the element changes.
     */
    private onContentChanged(): void
    {
        const innerText = this.ignoreWhitespace
            ? this._element.innerText.trim()
            : this._element.innerText;

        this.value = !(Array.from(this._element.children).some(e => e.nodeType !== 8) || innerText !== "");

        this._element.setAttribute("empty", this.value.toString());
    }
}
