import { autoinject, bindable } from "aurelia-framework";
import Popper from "popper.js";
import { EventManager } from "shared/utilities";

/**
 * Custom element representing a dropdown, typically attached to a button or input.
 */
@autoinject
export class DropdownCustomElement
{
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;
    private readonly _eventManager = new EventManager(this);
    private _classMutationObserver: MutationObserver;
    private _popper: Popper | undefined;
    private _visible: boolean;

    /**
     * The element that owns the dropdown.
     * This is typically the input or button to which the dropdown is attached.
     * If not specified, this will be the parent element of the dropdown.
     */
    @bindable
    public owner: HTMLElement | SVGElement;

    /**
     * The function function to call when the dropdown closes.
     */
    @bindable
    public close: () => boolean | void;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        if (this.owner == null)
        {
            this.owner = this._element.parentElement!;
        }
    }

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Listen for interaction events, that might indicate that the dropdown should close.
        this._eventManager.addEventListener(document.documentElement, "keydown", event => this.onKeyDownAnywhere(event as KeyboardEvent));
        this._eventManager.addEventListener(document.documentElement, "mousedown", event => this.onInteractionAnywhere(event), { capture: true });
        this._eventManager.addEventListener(document.documentElement, "touchstart", event => this.onInteractionAnywhere(event), { capture: true });
        this._eventManager.addEventListener(document.documentElement, "focusin", event => this.onInteractionAnywhere(event), { capture: true });

        // Observe for mutations of the class list, that might affect the visibility or position.
        this._classMutationObserver = new MutationObserver(() => this.updateVisibilityAndPosition());
        this._classMutationObserver.observe(this._element, { attributes: true, attributeFilter: ["class"] });

        this.ownerChanged();
        this.updateVisibilityAndPosition();
    }

    /**
     * Called by the framework when the component is attached.
     */
    public detached(): void
    {
        // Dispose event listeners.
        this._eventManager.removeEventListeners();

        // Dispose mutation observers.
        this._classMutationObserver.disconnect();

        // Dispose the `Popper` instance.
        if (this._popper)
        {
            this._popper.destroy();
            this._popper = undefined;
        }

        // Reset the visibility state.
        this._visible = false;
    }

    /**
     * Called by the framework when the `owner` property changes.
     */
    protected ownerChanged(): void
    {
        // Dispose the `Popper` instance for the previous owner, if any.
        if (this._popper != null)
        {
            this._popper.destroy();
        }

        // Create the `Popper` instance for the new owner.
        this._popper = new Popper(this.owner, this._element,
        {
            placement: "bottom-start",
            positionFixed: true,
            modifiers:
            {
                preventOverflow:
                {
                    escapeWithReference: true
                }
            }
        });
    }

    /**
     * Called when the component is attached, and when the class list of the element changes.
     * Updates the visibility to reflect the state of the element in the DOM.
     */
    protected updateVisibilityAndPosition(): void
    {
        // Determine visibility based on the computed style of the element.

        const style = getComputedStyle(this._element);

        this._visible =
            (!style.visibility || style.visibility === "visible") &&
            (!style.display || style.display !== "none") &&
            (!style.opacity || style.opacity !== "0");

        // If the element is visible, update the position.
        if (this._visible)
        {
            this._popper!.update();
        }
    }

    /**
     * Called when a key is pressed anywhere on the page.
     * Closes the dropdown if the `Escape` key is pressed.
     * @param event The keyboard event.
     */
    private onKeyDownAnywhere(event: KeyboardEvent): void
    {
        if (this._visible && !event.defaultPrevented && event.key === "Escape")
        {
            // Call the `close` callback method, which handles the actual closing of the dropdown.
            const canClose = this.close();

            // If the callback returned true, indicating that the dropdown was closed, blur the currently focused element.
            if (canClose !== false)
            {
                // Only blur if the focused element is related to the dropdown or its owner.
                if (this._element.contains(document.activeElement) || this.owner.contains(document.activeElement))
                {
                    (document.activeElement as HTMLElement | SVGElement).blur();
                }
            }
        }
    }

    /**
     * Called when the user clicks or touches anywhere on the page.
     * Closes the dropdown if the event did not originate from the dropdown or its owner.
     * @param event The interaction event.
     */
    private onInteractionAnywhere(event: Event): void
    {
        const target = event.target as HTMLElement | SVGElement;

        if (this._visible && !this._element.contains(target) && !this.owner.contains(target))
        {
            this.close();
        }
    }
}
