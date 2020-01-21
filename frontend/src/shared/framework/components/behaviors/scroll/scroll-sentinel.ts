import { autoinject, bindable } from "aurelia-framework";

/**
 * Custom element that acts as a sentinel for infinite scrolling.
 */
@autoinject
export class ScrollSentinelCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which the attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement | SVGElement;
    }

    private readonly _element: HTMLElement | SVGElement;
    private _intersectionObserver: IntersectionObserver;
    private _pendingIntersects = 0;

    /**
     * The function to call when the sentinel is scrolled into view.
     * Note that if the function returns a promise, the sentinel will
     * remain in the `pending` state until the promise is settled.
     */
    @bindable
    public intersect: (() => any | Promise<any>) | undefined;

    /**
     * True if the `intersect` function returned a promise, and that
     * promise is not yet settled, otherwise false.
     */
    @bindable
    public pending = false;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this._intersectionObserver = new IntersectionObserver(async entries =>
        {
            if (entries[0].intersectionRatio > 0 && this.intersect != null)
            {
                try
                {
                    this.pending = true;
                    this._pendingIntersects++;

                    await this.intersect();
                }
                finally
                {
                    this._pendingIntersects--;

                    if (this._pendingIntersects === 0)
                    {
                        this.pending = false;
                    }
                }
            }
        });

        this._intersectionObserver.observe(this._element);
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        this._intersectionObserver.disconnect();
    }
}
