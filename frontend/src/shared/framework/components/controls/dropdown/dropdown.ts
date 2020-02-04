import { autoinject, bindable } from "aurelia-framework";
import Popper, { Placement } from "popper.js";
import { EventManager } from "shared/utilities";

/**
 * Custom element representing a dropdown, typically attached to a button or input.
 */
@autoinject
export class DropdownCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;
    private readonly _eventManager = new EventManager(this);
    private _mutationObserver: MutationObserver;
    private _popper: Popper | undefined;
    private _attached = false;
    private _visible: boolean;

    /**
     * The element that owns the dropdown.
     * This is typically the input or button to which the dropdown is attached.
     * If not specified, this will be the parent element of the dropdown.
     */
    @bindable({ changeHandler: "createPopper" })
    public owner: HTMLElement | SVGElement;

    /**
     * True to use `fixed` positioning, otherwise false.
     * This may be needed if the dropdown is placed within a container that
     * hides overflowing content, but note that it has a performance cost.
     */
    @bindable({ changeHandler: "createPopper", defaultValue: false })
    public fixed: boolean;

    /**
     * The placement of the dropdown, relative to its owner.
     */
    @bindable({ changeHandler: "createPopper", defaultValue: "bottom-start" })
    public placement: Placement;

    /**
     * The function to call when the dropdown wants to close.
     */
    @bindable
    public close: (params:
    {
        // True if closing because the `Escape` key was pressed, otherwise false.
        escape: boolean;

    }) => void;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // If no owner element is set, use the parent element.
        if (this.owner == null)
        {
            this.owner = this._element.parentElement!;
        }

        // Listen for interaction events, that might indicate that the dropdown should close.
        this._eventManager.addEventListener(this.owner, "keydown", event => this.onKeyDownAnywhere(event as KeyboardEvent));
        this._eventManager.addEventListener(document.documentElement, "mousedown", event => this.onInteractionAnywhere(event), { capture: true });
        this._eventManager.addEventListener(document.documentElement, "touchstart", event => this.onInteractionAnywhere(event), { capture: true });
        this._eventManager.addEventListener(document.documentElement, "focusin", event => this.onInteractionAnywhere(event), { capture: true });

        // Listen for mutations within the dropdown or its owner, that might affect the visibility, size or position of the dropdown.
        this._mutationObserver = new MutationObserver(() => this.updateVisibilityAndPosition());
        this._mutationObserver.observe(this._element, { attributes: true, attributeFilter: ["class"], childList: true, subtree: true, characterData: true });
        this._mutationObserver.observe(this.owner, { attributes: true, attributeFilter: ["class"], childList: true, subtree: true, characterData: true });

        // Indicate that the component is attached.
        this._attached = true;

        // Create the `Popper`instance.
        this.createPopper();
    }

    /**
     * Called by the framework when the component is attached.
     */
    public detached(): void
    {
        // Dispose event listeners.
        this._eventManager.removeEventListeners();

        // Dispose mutation observers.
        this._mutationObserver.disconnect();

        // Dispose the `Popper` instance.
        if (this._popper)
        {
            this._popper.destroy();
            this._popper = undefined;
        }

        // Reset the state.
        this._visible = false;
        this._attached = false;
    }

    /**
     * Called when the component is attached, and when the `owner` or `fixed` properties change
     * Creates a new `Popper` instance, then updates visibility and position.
     */
    protected createPopper(): void
    {
        // Don't do anything while binding.
        if (!this._attached)
        {
            return;
        }

        // Dispose the `Popper` instance for the previous owner, if any.
        if (this._popper != null)
        {
            this._popper.destroy();
        }

        // Create the `Popper` instance for the new owner.
        this._popper = new Popper(this.owner, this._element,
        {
            placement: this.placement,
            positionFixed: this.fixed,
            modifiers:
            {
                preventOverflow:
                {
                    escapeWithReference: true
                }
            }
        });

        // Update the visibility and position.
        this.updateVisibilityAndPosition();
    }

    /**
     * Called when a new `Popper` instance is created, and when the class list of the element changes.
     * Determines whether the dropdown is visible, and if it is, updates its position.
     */
    protected updateVisibilityAndPosition(): void
    {
        // Determine visibility based on the computed style of the element.

        const style = getComputedStyle(this._element);

        this._visible =
            (!style.visibility || style.visibility === "visible") &&
            (!style.display || style.display !== "none") &&
            (!style.opacity || style.opacity !== "0");

        // If the element is visible, update its position.
        if (this._visible)
        {
            this._popper!.update();
        }

        // If using fixed positioning, set min-width to match the owner.

        if (this.fixed)
        {
            const ownerStyle = getComputedStyle(this.owner);
            this._element.style.minWidth = ownerStyle.width;
        }
        else
        {
            this._element.style.minWidth = "";
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
            event.preventDefault();
            this.close({ escape: true });
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
            event.preventDefault();
            this.close({ escape: false });
        }
    }
}
