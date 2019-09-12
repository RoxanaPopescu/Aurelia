import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { EventManager } from "shared/utilities";

// Load the CSS associated with this attribute.
import "./scroll.scss";

/**
 * Represents the public interface for a `ScrollCustomAttribute`.
 */
export interface IScroll
{
    /**
     * Resets the scroll position.
     * @param options The scroll options specifying the behavior.
     */
    reset(options?: ScrollOptions): void;

    /**
     * Resets the scroll position.
     * @param options The scroll options specifying the offset and behavior.
     */
    scrollTo(options: ScrollToOptions): void;
}

/**
 * Custom attribute that makes the element to which it is applied scrollable.
 * Also provides support for fading out elements at the top of the scroll area.
 */
@autoinject
export class ScrollCustomAttribute implements IScroll
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which the attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement | SVGElement;
        this._eventManager = new EventManager(this);
    }

    private readonly _element: HTMLElement | SVGElement;
    private readonly _eventManager: EventManager;

    /**
     * The current scroll position.
     * Note that the element will scroll to this position when the attribute is attached.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public position: ScrollToOptions | undefined;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // TODO: Why is this needed? It shouldn't be...
        this._element.setAttribute("scroll", "");

        let timeoutHandle: any;
        let fadeTargets: any[] | undefined;

        this._eventManager.addEventListener(this._element, "scroll", () =>
        {
            // Only handle events that represent actual changes in the scroll position.
            // This is needed because the class changes may trigger unexpected scroll events.
            if (this.position == null ||
                this._element.scrollTop !== this.position.top ||
                this._element.scrollLeft !== this.position.left)
            {
                // Update the bindable scroll position.
                this.position =
                {
                    // Preserve any existing scroll options.
                    ...this.position,

                    top: this._element.scrollTop,
                    left: this._element.scrollLeft
                };

                if (timeoutHandle == null)
                {
                    // Disable hover effects while scrolling.
                    this._element.classList.add("disable-hover");

                    // Get any elements that should be faded.
                    fadeTargets = Array.from(this._element.querySelectorAll("[scroll-fade]")).map((element: HTMLElement) =>
                    ({
                        element,
                        height: element.getBoundingClientRect().height,
                        fadeFactor: +(element.getAttribute("scroll-fade") || ScrollCustomAttribute.fadeFactor)
                    }));
                }
                else
                {
                    clearTimeout(timeoutHandle);
                }

                // Fade elements relative to the scroll offset.
                for (const fadeTarget of fadeTargets!)
                {
                    fadeTarget.element.style.opacity =
                        Math.max(0, 1 - (Math.max(0, this._element.scrollTop) / fadeTarget.height) * fadeTarget.fadeFactor);
                }

                timeoutHandle = setTimeout(() =>
                {
                    timeoutHandle = undefined;

                    // Clean up any references to faded elements.
                    fadeTargets = undefined;

                    // Enable hover effects.
                    this._element.classList.remove("disable-hover");
                },
                200);
            }
        });

        if (this.position)
        {
            // Scroll to the specified position.
            this._element.scrollTo(this.position);
        }
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        this._eventManager.removeEventListeners();
    }

    /**
     * Resets the scroll position.
     * @param options The scroll options specifying behavior.
     */
    public reset(options?: ScrollOptions): void
    {
        this._element.scrollTo({ top: 0, left: 0, ...options });
    }

    /**
     * Scrolls to the specified position.
     * @param options The scroll options specifying the offset and behavior.
     */
    public scrollTo(options: ScrollToOptions): void
    {
        this._element.scrollTo(options);
    }

    /**
     * Called by the framework when the `position` property changes.
     * Scrolls to the specified position.
     */
    protected positionChanged(): void
    {
        if (this.position)
        {
            this._element.scrollTo(this.position);
        }
    }

    /**
     * The default factor determining how quickly elements with the `scroll-fade`
     * attribute fade out as they leave the scrollport. This may be overridden by
     * specifying a value for the `scroll-fade` attribute.
     */
    public static fadeFactor = 1;
}
