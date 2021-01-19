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
     * The current scroll position of the element.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public position: undefined | ScrollToOptions &
    {
        /**
         * True if this position was created initially or as a result of a scroll event, false or undefined
         * if the position represents a position to which the element should attempt to scroll.
         */
        internal?: boolean;
    };

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // TODO: Why is this needed? It shouldn't be...
        this._element.setAttribute("scroll", "");

        let fadeTargets: IFadeTarget[] = [];
        let timeoutHandle: any;
        let animationFrameHandle: any;

        this._eventManager.addEventListener(this._element, "scroll", () =>
        {
            // Cancel any existing animation frame request.
            cancelAnimationFrame(animationFrameHandle);

            // Request an animation frame.
            animationFrameHandle = requestAnimationFrame(() =>
            {
                // Get the scroll position only once, as it triggers layout.
                // We need to limit this to 0, as the offset may become negative due to scroll bouncing.
                const scrollTop = Math.max(this._element.scrollTop, 0);
                const scrollLeft = Math.max(this._element.scrollLeft, 0);

                // Only handle events that represent actual changes in the scroll position.
                // This is needed because the class changes may trigger unexpected scroll events.
                if (this.position == null || scrollTop !== this.position.top || scrollLeft !== this.position.left)
                {
                    // Update the bindable scroll position.
                    this.position =
                    {
                        // Preserve any existing scroll options.
                        ...this.position,

                        top: scrollTop,
                        left: scrollLeft,

                        internal: true
                    };

                    // Is this the first scroll event in a sequence?
                    if (timeoutHandle == null)
                    {
                        if (fadeTargets == null)
                        {
                            // Get the fade targets immediately, as we otherwise have nothing to fade.
                            fadeTargets = this.getFadeTargets();
                        }
                        else
                        {
                            // Get the fade targets in an animation frame, so we can fade the already known targets immediately.
                            requestAnimationFrame(() =>
                            {
                                // Get any elements that should be faded.
                                fadeTargets = this.getFadeTargets();
                            });
                        }
                    }
                    else
                    {
                        // Still scrolling, so the end of the sequence should be rescheduled.
                        clearTimeout(timeoutHandle);
                    }

                    // Fade elements relative to the scroll offset.
                    for (const fadeTarget of fadeTargets)
                    {
                        fadeTarget.element.style.opacity =
                            Math.max(0, 1 - (scrollTop / fadeTarget.height) * fadeTarget.fadeFactor).toString();
                    }

                    // Schedule the end of the sequernce.
                    timeoutHandle = setTimeout(() => timeoutHandle = undefined, 300);
                }
            });
        });

        if (this.position)
        {
            // Scroll to the specified position.
            this._element.scrollTo(this.position);
        }
        else
        {
            // Get the scroll position.
            // We need to limit this to 0, as the offset may become negative due to scroll bouncing.
            const scrollTop = Math.max(this._element.scrollTop, 0);
            const scrollLeft = Math.max(this._element.scrollLeft, 0);

            // Update the bindable scroll position.
            this.position =
            {
                top: scrollTop,
                left: scrollLeft,

                internal: true
            };
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
        if (this.position && !this.position.internal)
        {
            this._element.scrollTo(this.position);
        }
    }

    /**
     * Gets the fade targets.
     */
    private getFadeTargets(): IFadeTarget[]
    {
        return Array.from(this._element.querySelectorAll("[scroll-fade]")).map((element: HTMLElement | SVGElement) =>
        ({
            element,
            height: element.getBoundingClientRect().height,
            fadeFactor: +(element.getAttribute("scroll-fade") || ScrollCustomAttribute.fadeFactor)
        }));
    }

    /**
     * The default factor determining how quickly elements with the `scroll-fade`
     * attribute fade out as they leave the scrollport. This may be overridden by
     * specifying a value for the `scroll-fade` attribute.
     */
    public static fadeFactor = 1;
}

/**
 * Represents a reference to an element that should fade during scroll.
 */
interface IFadeTarget
{
    /**
     * The element that should be faded.
     */
    element: HTMLElement | SVGElement;

    /**
     * The height of the element.
     */
    height: number;

    /**
     * The fade factor associated with the element.
     */
    fadeFactor: number;
}
