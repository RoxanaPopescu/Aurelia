import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { CssAnimator } from "aurelia-animator-css";

/**
 * Custom attribute that detects when the element enters and leaves the viewport,
 * and applies class names accordingly. Use this to e.g. animate elements in as they
 * enter the viewport.
 *
 * @example
 *
 * // Apply the `reveal` animation when the element enters the viewport.
 * <div intersection class="au-animate animation-reveal">...</div>
 */
@autoinject
export class IntersectionCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param cssAnimator The `CssAnimator` instance.
     */
    public constructor(element: Element, cssAnimator: CssAnimator)
    {
        this._element = element as HTMLElement;
        this._cssAnimator = cssAnimator;
    }

    private readonly _element: HTMLElement;
    private readonly _cssAnimator: CssAnimator;
    private _IntersectionObserver: IntersectionObserver;

    /**
     * The ancestor element to use as the viewport, or undefined to use the browser viewport.
     */
    @bindable
    public root: Element | undefined;

    /**
     * The margin around the root. This accepts values similar to the CSS `margin` property,
     * e.g. `10px 20px 30px 40px` (top, right, bottom, left). The values must be in `px` or `%`.
     * This set of values serves to grow or shrink each side of the root element's bounding box
     * before computing intersections. The default is all zeros.
     */
    @bindable
    public rootMargin: string;

    /**
     * The fraction of the element that must enter the viewport, before the intersection is detected.
     * The default is 0, meaning that the intersection is detected when the first pixel enters the viewport.
     */
    @bindable
    public threshold: number;

    /**
     * True if the element is considered visible, otherwise false.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public intersecting: boolean;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        if (this._element.classList.contains("au-animate"))
        {
            this._element.classList.add("au-enter");
        }
    }

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this.propertyChanged();
    }

    /**
     * Called by the framework when the component is unbinding.
     */
    public unbind(): void
    {
        this._IntersectionObserver.unobserve(this._element);
    }

    /**
     * Called by the framework when a property changes.
     * Creates, or re-creates, the intersection observer.
     */
    protected propertyChanged(): void
    {
        this._IntersectionObserver?.unobserve(this._element);

        const options =
        {
            root: this.root,
            rootMargin: this.rootMargin?.replace(/(\d+)(\s|$)/g, "$1px$2"),
            threshold: this.threshold
        };

        this._IntersectionObserver = new IntersectionObserver(([entry]) =>
        {
            this.intersecting = entry.isIntersecting;

            if (this.intersecting)
            {
                this._element.classList.add("intersection-crossed");
            }

            this._element.classList.toggle("intersection-visible", this.intersecting);

            if (this._element.classList.contains("au-animate"))
            {
                if (this.intersecting)
                {
                    // tslint:disable-next-line: no-floating-promises
                    this._cssAnimator.enter(this._element);
                }
                else
                {
                    // tslint:disable-next-line: no-floating-promises
                    this._cssAnimator.leave(this._element);
                }
            }

        }, options);

        this._IntersectionObserver.observe(this._element);
    }
}
