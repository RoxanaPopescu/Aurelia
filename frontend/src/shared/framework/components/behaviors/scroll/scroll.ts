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

        let isScrollingUp: boolean | undefined;
        let timeoutHandle: any;
        let fadeTargets: any[] | undefined;

        this._eventManager.addEventListener(this._element, "scroll", () =>
        {
            // Get the scroll position only once, as it triggers layout.
            // We need to limit this to 0, as the offset may become negative due to scroll bouncing.
            const scrollTop = Math.max(this._element.scrollTop, 0);
            const scrollLeft = Math.max(this._element.scrollLeft, 0);

            // Only handle events that represent actual changes in the scroll position.
            // This is needed because the class changes may trigger unexpected scroll events.
            if (this.position == null || scrollTop !== this.position.top || scrollLeft !== this.position.left)
            {
                // Is the user scrolling towards the top?
                const newIsScrollingUp = this.position != null && scrollTop < this.position.top!;

                // Has the scroll direction changed?
                if (newIsScrollingUp !== isScrollingUp)
                {
                    isScrollingUp = newIsScrollingUp;

                    // Set the fade duration and timing function, to ensure smooth fading
                    // when scrolling down, and minimal flashing when scrolling back up.
                    this._element.style.setProperty("--fade-duration", isScrollingUp ? `${0}s` : `${0.067}s`);
                    this._element.style.setProperty("--fade-timing-function", isScrollingUp ? "ease-in" : "ease-out");
                }

                // Update the bindable scroll position.
                this.position =
                {
                    // Preserve any existing scroll options.
                    ...this.position,

                    top: scrollTop,
                    left: scrollLeft
                };

                // Is this the first scroll event in a sequence?
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
                    // Still scrolling, so the ending of the sequence should be rescheduled.
                    clearTimeout(timeoutHandle);
                }

                // Fade elements relative to the scroll offset.
                for (const fadeTarget of fadeTargets!)
                {
                    fadeTarget.element.style.opacity =
                        Math.max(0, 1 - (Math.max(0, scrollTop) / fadeTarget.height) * fadeTarget.fadeFactor);
                }

                // Clean up when the sequence ends.
                timeoutHandle = setTimeout(() =>
                {
                    // Clear timeout handle.
                    timeoutHandle = undefined;

                    // Clear the current scroll direction.
                    isScrollingUp = undefined;

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
        // Remove event listeners.
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
