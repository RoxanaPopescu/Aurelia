import { autoinject, bindable } from "aurelia-framework";
import { createFocusTrap, FocusTrap, Options, FocusTarget } from "focus-trap";
import { EventManager } from "shared/utilities";

/**
 * Custom attribute that traps focus within the element to which it is applied.
 */
@autoinject
export class TrapFocusCustomAttribute implements Options
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _eventManager = new EventManager(this);
    private readonly _element: HTMLElement;
    private _focusTrap: FocusTrap;
    private _active = false;

    /**
     * True or an empty string to enable the focus trap, otherwise false.
     * The default is true.
     */
    @bindable({ primaryProperty: true, defaultValue: true })
    public enabled: boolean | "";

    /**
     * A function that will be called when the focus trap activates.
     */
    @bindable
    public onActivate: (() => void) | undefined;

    /**
     * A function that will be called when the focus trap deactivates.
     */
    @bindable
    public onDeactivate: (() => void) | undefined;

    /**
     * By default, when a focus trap is activated the first element in the
     * focus traps tab order will receive focus. With this option you can
     * specify a different element to receive that initial focus.
     */
    @bindable
    public initialFocus: FocusTarget | undefined;

    /**
     * By default, an error will be thrown if the focus trap contains no
     * elements in its tab order. With this option you can specify a
     * fallback element to programmatically receive focus if no other
     * tabbable elements are found. For example, you may want a modal
     * element to receive focus if none of its descendent elements are
     * tabbable. Make sure the fallback element has a negative `tabindex`
     * so it can be programmatically focused.
     */
    @bindable
    public fallbackFocus: FocusTarget | undefined;

    /**
     * True to, when the trap is disabled, return focus to the element
     * that had focus before activation, otherwise false. Note that if
     * disabled due to a click outside, focus remains on the click target.
     * The default is true.
     */
    @bindable({ defaultValue: true })
    public returnFocusOnDeactivate: boolean;

    /**
     * True to disable the trap when the user presses the `Escape` key,
     * false to do nothing.
     * The default is true.
     */
    @bindable({ defaultValue: true })
    public escapeDeactivates: boolean;

    /**
     * True to disable the trap when the user clicks outside the element,
     * and allow the click to be handled as it normally would. False to
     * intercept and block the click.
     * The default is true.
     */
    @bindable({ defaultValue: true })
    public clickOutsideDeactivates: boolean;

    /**
     * Called by the framework when the `enabled` property changes.
     */
    public enabledChanged(): void
    {
        // Return if not yet attached.
        if (this._focusTrap == null)
        {
            return;
        }

        if (this.enabled !== false)
        {
            this._focusTrap.activate();
        }
        else
        {
            this._focusTrap.deactivate();
        }
    }

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this._focusTrap = createFocusTrap(this._element,
        {
            onActivate: this.onActivating.bind(this),
            onDeactivate: this.onDeactivating.bind(this),
            initialFocus: this.initialFocus,
            fallbackFocus: this.fallbackFocus,
            returnFocusOnDeactivate: this.returnFocusOnDeactivate,
            escapeDeactivates: this.escapeDeactivates,
            clickOutsideDeactivates: this.clickOutsideDeactivates
        });

        if (this.enabled !== false)
        {
            this._focusTrap.activate();
        }

        this._eventManager.addEventListener(this._element, "focusin", this.onFocusIn.bind(this));
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        this._eventManager.removeEventListeners();

        this._focusTrap.deactivate();
    }

    /**
     * Handler for the trap activation event.
     */
    private onActivating(): void
    {
        this._active = true;

        if (this.onActivate != null)
        {
            this.onActivate();
        }
    }

    /**
     * Handler for the trap deactivation event.
     */
    private onDeactivating(): void
    {
        this._active = false;

        if (this.onDeactivate != null)
        {
            this.onDeactivate();
        }
    }

    /**
     * Handler for the `focusin` event, which activate the focus trap when when the element,
     * or one of its decendents, receive focus.
     */
    private onFocusIn(): void
    {
        if (!this._active && this.enabled !== false)
        {
            this._focusTrap.activate();
        }
    }
}
