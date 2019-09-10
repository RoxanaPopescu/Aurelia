import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a busy overlay that covers its parent element, and optionally hides its contents.
 * Note that the parent element must be positioned.
 */
@autoinject
export class BusyOverlayCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;
    private _parentElement: HTMLElement;
    private _xScrollElement: HTMLElement;
    private _yScrollElement: HTMLElement;
    private _scheduledUpdateHandle: any;

    /**
     * The element containing the busy indicator.
     * This will be continuously resized to fit the visible area
     * of the element in which this component is located.
     */
    protected busyOverlayContainerElement: HTMLElement;

    /**
     * True to use a opaque overlay that hides the contents of the parent element,
     * false to use a semi-transparent overlay that allows the content to shine through.
     */
    @bindable({ defaultValue: false })
    public opaque: boolean;

    /**
     * True to apply a fade-in animation, otherwise false.
     * This can help mitigate flashing if the overlay is quickly removed.
     */
    @bindable({ defaultValue: true })
    public animate: boolean;

    /**
     * True to apply delay before the fade-in animation, otherwise false.
     * This can help mitigate flashing if the overlay is quickly removed.
     */
    @bindable({ defaultValue: false })
    public delay: boolean;

    /**
     * Called by the framework when the element is attached.
     * Starts the scheduling of size updates.
     */
    public attached(): void
    {
        // Get the parent element.
        // This must be stored, as we need it when the componen is detached.
        this._parentElement = this._element.parentElement as HTMLElement;

        // Prevent interaction with the parent element.
        this._parentElement.inert = true;

        // Find the scroll parent or parents.
        this._xScrollElement = this.findScrollParent(true, true, false);
        this._yScrollElement = this.findScrollParent(true, false, true);

        // Begin scheduling size updates.
        this.beginUpdatingSize();
    }

    /**
     * Called by the framework when the element is detached.
     * Stops the scheduling of size updates.
     */
    public detached(): void
    {
        // Stop scheduling size updates.
        cancelAnimationFrame(this._scheduledUpdateHandle);

        // Allow interaction with the parent element.
        this._parentElement.inert = false;
    }

    /**
     * Schedules a size update on every animation frame, until the component is detached.
     */
    private beginUpdatingSize(): void
    {
        this._scheduledUpdateHandle = requestAnimationFrame(() =>
        {
            this.busyOverlayContainerElement.style.height = `${this.getVisibleHeight()}px`;
            this.busyOverlayContainerElement.style.width = `${this.getVisibleWidth()}px`;

            this.beginUpdatingSize();
        });
    }

    // TODO: Consider refactoring the below methods out into a shared helper library.

    /**
     * Finds the closest ancestor element that is scrollable.
     * @param includeHidden True to include elements with hidden overflow, otherwise false.
     * @param overflowX True to require horizontal scrolling, false to not consider this axis.
     * @param overflowY True to require vertical scrolling, false to not consider this axis.
     * @returns The closest ancestor element that is scrollable.
     */
    private findScrollParent(includeHidden = true, overflowX = true, overflowY = true): HTMLElement
    {
        // Based on port of the JQuery `scrollParent` method.
        // See: https://stackoverflow.com/a/42543908

        let style = getComputedStyle(this._element);
        const excludeStaticParent = style.position === "absolute";
        const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

        if (style.position === "fixed")
        {
            return document.documentElement;
        }

        let parent: HTMLElement | null = this._element;

        while (parent != null)
        {
            style = getComputedStyle(parent);

            if (excludeStaticParent && style.position === "static")
            {
                parent = parent.parentElement;

                continue;
            }

            if (overflowRegex.test(`${style.overflow} ${overflowX && style.overflowX} ${overflowY && style.overflowY}`))
            {
                return parent;
            }

            parent = parent.parentElement;
        }

        return document.documentElement;
    }

    /**
     * Gets the width of the visible area of the element in which this component is located.
     */
    private getVisibleWidth(): number
    {
        if (this._xScrollElement === this._element.parentElement)
        {
            return this._xScrollElement.offsetWidth;
        }

        const scrollElementWidth = this._xScrollElement.offsetWidth;
        const scrollElementLeftToElementLeft = Math.max(this._element.parentElement!.getBoundingClientRect().left, 0);
        const scrollElementLeftToElementRight = Math.max(Math.min(this._element.parentElement!.getBoundingClientRect().right, scrollElementWidth), 0);

        return scrollElementLeftToElementRight - scrollElementLeftToElementLeft;
    }

    /**
     * Gets the height of the visible area of the element in which this component is located.
     */
    private getVisibleHeight(): number
    {
        if (this._yScrollElement === this._element.parentElement)
        {
            return this._yScrollElement.offsetHeight;
        }

        const scrollElementHeight = this._yScrollElement.offsetHeight;
        const scrollElementTopToElementTop = Math.max(this._element.parentElement!.getBoundingClientRect().top, 0);
        const scrollElementTopToElementBottom = Math.max(Math.min(this._element.parentElement!.getBoundingClientRect().bottom, scrollElementHeight), 0);

        return scrollElementTopToElementBottom - scrollElementTopToElementTop;
    }
}
