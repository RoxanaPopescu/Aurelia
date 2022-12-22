import { autoinject, bindable, bindingMode } from "aurelia-framework";

// HACK:
// This attribute causes significant performance issues when used in a data-table.
// Therefore, to reduce the performance impact, we queue initializations and updates,
// so they execute in batches and don't impact the load time of the list.
let queuedFuncs = new Set<() => void>();
let flushTimeoutHandle: any;

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
    private _childListMutationObserver: MutationObserver;
    private _textNodeMutationObserver: MutationObserver;

    /**
     * The name of the attribute.
     */
    protected attributeName = "empty";

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
        queuedFuncs.add(this.initialize);

        if (flushTimeoutHandle == null)
        {
            flushTimeoutHandle = setTimeout(() =>
            {
                flushTimeoutHandle = undefined;

                const funcs = queuedFuncs;
                queuedFuncs = new Set<() => void>();

                document.body.classList.add(`--${this.attributeName}-busy`);
                funcs.forEach(f => f());
                document.body.classList.remove(`--${this.attributeName}-busy`);
            });
        }
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        queuedFuncs.delete(this.initialize);
        queuedFuncs.delete(this.update);

        this._childListMutationObserver?.disconnect();
        this._textNodeMutationObserver?.disconnect();
    }

    /**
     * Called when the text in a child node of the element changes.
     */
    private onContentChanged(): void
    {
        queuedFuncs.add(this.update);

        if (flushTimeoutHandle == null)
        {
            flushTimeoutHandle = setTimeout(() =>
            {
                flushTimeoutHandle = undefined;

                const funcs = queuedFuncs;
                queuedFuncs = new Set<() => void>();

                document.body.classList.add(`--${this.attributeName}-busy`);
                funcs.forEach(f => f());
                document.body.classList.remove(`--${this.attributeName}-busy`);
            });
        }
    }

    /**
     * Determines whether the element is considered empty, and updates the attribute accordingly.
     */
    private readonly initialize = () =>
    {
        this._childListMutationObserver = new MutationObserver(mutations => this.onChildListChanged(mutations));
        this._textNodeMutationObserver = new MutationObserver(mutations => this.onContentChanged());

        this._childListMutationObserver.observe(this._element, { childList: true, characterData: true });

        this.update();

        this._element.childNodes.forEach(node =>
        {
            if (node.nodeType === 3)
            {
                this._textNodeMutationObserver.observe(node, { characterData: true });
            }
        });
    }

    /**
     * Determines whether the element is considered empty, and updates the attribute accordingly.
     */
    private readonly update = () =>
    {
        const innerText = this.ignoreWhitespace
            ? this._element.innerText.trim()
            : this._element.innerText;

        this.value = !(Array.from(this._element.children).some(e => e.nodeType !== 8) || innerText !== "");

        this._element.setAttribute(this.attributeName, this.value.toString());
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
}
