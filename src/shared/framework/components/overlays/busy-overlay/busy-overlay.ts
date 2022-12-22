import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a rectangular area.
 */
interface IRect
{
    top: number;
    left: number;
    right: number;
    bottom: number;
    height: number;
    width: number;
}

/**
 * Represents a scrollable ancestor element.
 */
interface IScrollParent
{
    overflowY: string;
    overflowX: string;
    element: HTMLElement;
}

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
    private _scrollParents: IScrollParent[];
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

        // Find the scroll parents.
        this._scrollParents = this.findScrollParents(this._element, true, true, true);

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

        // Remove any styles applied to compensate for scroll offsets.
        this._element.style.top = "";
        this._element.style.height = "";
        this._element.style.left = "";
        this._element.style.width = "";
    }

    /**
     * Schedules a size update on every animation frame, until the component is detached.
     */
    private beginUpdatingSize(): void
    {
        this._scheduledUpdateHandle = requestAnimationFrame(() =>
        {
            const visibleRect = this.getVisibleParentRect();

            this.busyOverlayContainerElement.style.height = `${visibleRect.height}px`;
            this.busyOverlayContainerElement.style.width = `${visibleRect.width}px`;
            this.busyOverlayContainerElement.style.top = `${visibleRect.top}px`;
            this.busyOverlayContainerElement.style.left = `${visibleRect.left}px`;

            if (this._scrollParents[0].element === this._element.parentElement)
            {
                this._element.style.top = `${this._scrollParents[0].element.scrollTop}px`;
                this._element.style.height = `${this._scrollParents[0].element.scrollHeight - this._scrollParents[0].element.scrollTop}px`;
                this._element.style.left = `${this._scrollParents[0].element.scrollLeft}px`;
                this._element.style.width = `${this._scrollParents[0].element.scrollWidth - this._scrollParents[0].element.scrollLeft}px`;
            }

            this.beginUpdatingSize();
        });
    }

    // TODO: Consider refactoring the below methods out into a shared helper library.

    /**
     * Finds all scrollable ancestor elements.
     * @param overflowY True to require vertical scrolling, false to not consider this axis.
     * @param overflowX True to require horizontal scrolling, false to not consider this axis.
     * @param includeHidden True to include elements with hidden overflow, otherwise false.
     * @returns The scrollable ancestor elements, with the last element always being the document element.
     */
    private findScrollParents(element: HTMLElement, overflowY = true, overflowX = true, includeHidden = true): IScrollParent[]
    {
        let style = getComputedStyle(document.documentElement);

        const scrollParents: IScrollParent[] = [];

        // Based on a port of the JQuery `scrollParent` method.
        // See: https://stackoverflow.com/a/42543908

        style = getComputedStyle(element);

        const excludeStaticParent = style.position === "absolute";
        const overflowRegex = includeHidden ? /(auto|scroll|overlay|hidden)/ : /(auto|scroll|overlay)/;

        if (style.position === "fixed")
        {
            return scrollParents;
        }

        let parent: HTMLElement | null = element;

        while (parent != null && parent !== document.documentElement)
        {
            style = getComputedStyle(parent);

            if (excludeStaticParent && style.position === "static")
            {
                parent = parent.parentElement;

                continue;
            }

            if (overflowY && overflowRegex.test(`${style.overflowY}`) || overflowX && overflowRegex.test(`${style.overflowX}`))
            {
                scrollParents.push({ overflowX: style.overflowX, overflowY: style.overflowY, element: parent });
            }

            parent = parent.parentElement;
        }

        scrollParents.push({
            overflowY: style.overflowY,
            overflowX: style.overflowX,
            element: document.documentElement
        });

        return scrollParents;
    }

    /**
     * Gets the rectangle for the visible area of the parent element.
     */
    private getVisibleParentRect(): IRect
    {
        let visibleRect = this.getInnerBoundingClientRect(this._element.parentElement!);

        for (const scrollParent of this._scrollParents)
        {
            if (visibleRect.width === 0 || visibleRect.height === 0)
            {
                break;
            }

            const scrollParentRect = this.getInnerBoundingClientRect(scrollParent.element);

            const newVisibleRect: any =
            {
                top: Math.max(0, Math.max(visibleRect.top, scrollParentRect.top)),
                left: Math.max(0, Math.max(visibleRect.left, scrollParentRect.left)),
                right: Math.max(0, Math.min(visibleRect.left + visibleRect.width, scrollParentRect.left + scrollParentRect.width)),
                bottom: Math.max(0, Math.min(visibleRect.top + visibleRect.height, scrollParentRect.top + scrollParentRect.height))
            };

            newVisibleRect.width = Math.max(0, newVisibleRect.right - newVisibleRect.left);
            newVisibleRect.height = Math.max(0, newVisibleRect.bottom - newVisibleRect.top);

            visibleRect = newVisibleRect;
        }

        return visibleRect;
    }

    /**
     * Gets the rectangle for the content area of the specified element.
     * @param element The element for which to get the content area.
     * @returns An object representing the rectangle for the content area.
     */
    private getInnerBoundingClientRect(element: HTMLElement): IRect
    {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);

        const result =
        {
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height
        };

        if (style.boxSizing === "border-box")
        {
            const borderTop = parseFloat(style.borderTop);
            const borderLeft = parseFloat(style.borderLeft);
            const borderRight = parseFloat(style.borderRight);
            const borderBottom = parseFloat(style.borderBottom);

            result.top += borderTop;
            result.left += borderLeft;
            result.right -= borderRight;
            result.bottom -= borderBottom;
            result.width -= (borderLeft + borderRight);
            result.height -= (borderTop + borderBottom);
        }

        return result;
    }
}
