import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { EventManager } from "shared/utilities";

/**
 * Custom attribute that makes the element to which it is applied scrollable.
 * Also provides support for fading out elements at the top of the scroll area.
 */
@autoinject
export class DataTableRowDragHandleCustomAttribute
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
        this._eventManager.addEventListener(this._element, "mousedown", () =>
        {
            
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
