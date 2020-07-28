import { autoinject, bindable } from "aurelia-framework";
import { EventManager } from "shared/utilities";

/**
 * Custom attribute that, when the element to which it is applied receives focus,
 * returns focus to the previously focused element.
 */
@autoinject
export class ReturnFocusCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement | SVGElement;
        this._eventManager = new EventManager(this);
    }

    private readonly _element: HTMLElement | SVGElement;
    private readonly _eventManager: EventManager;
    private _lastFocusedElement: HTMLElement | SVGElement;

    /**
     * True or an empty string to enable focus return, otherwise false.
     * The default is true.
     */
    @bindable({ primaryProperty: true, defaultValue: true })
    public enabled: boolean | "";

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this._eventManager.addEventListener(window.document, "focusout", event =>
        {
            this._lastFocusedElement = event.target as HTMLElement | SVGElement;
        });

        this._eventManager.addEventListener(this._element, "focusin", event =>
        {
            if (this._lastFocusedElement != null)
            {
                this._lastFocusedElement.focus();
            }
        });
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        // Remove event listeners.
        this._eventManager.removeEventListeners();
    }
}
