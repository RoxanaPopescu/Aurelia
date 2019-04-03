import { autoinject } from "aurelia-framework";
import { EventManager } from "shared/utilities";

// Load the CSS associated with this attribute.
import "./scroll.scss";

/**
 * Custom attribute that makes the element to which it is applied scrollable.
 * Also provides support for fading out elements at the top of the scroll area.
 */
@autoinject
export class ScrollCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which the attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element;
        this._eventManager = new EventManager(this);
    }

    private readonly _element: Element;
    private readonly _eventManager: EventManager;

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
        });
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        this._eventManager.removeEventListeners();
    }

    /**
     * The default factor determining how quickly elements with the `scroll-fade`
     * attribute fade out as they leave the scrollport. This may be overridden by
     * specifying a value for the `scroll-fade` attribute.
     */
    public static fadeFactor = 1;
}
