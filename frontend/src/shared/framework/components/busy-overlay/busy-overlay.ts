import { autoinject } from "aurelia-framework";
import { EventManager } from "shared/utilities";

/**
 * Represents an overlay that covers the component in which it is placed,
 * blocking pointer interaction and indicating that the component is busy.
 */
@autoinject
export class BusyOverlayCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
        this._eventManager = new EventManager(this);
    }

    private readonly _element: HTMLElement;
    private readonly _eventManager: EventManager;

    /**
     * Called by the framework when the element is attached.
     */
    public attached(): void
    {
        // The events that should be prevented from propagating to the
        // element in which this overlay is placed.
        const eventsToBlock = ["keydown", "keydown", "keypress", "keyup"];

        this._eventManager.addEventListener(this._element.parentElement!,
            eventsToBlock, event => this.onEventCaptured(event), { capture: true });
    }

    /**
     * Called by the framework when the element is detached.
     */
    public detached(): void
    {
        this._eventManager.removeEventListeners();
    }

    /**
     * Called when an event is captured.
     * Prevents the event from propagating any further.
     */
    private onEventCaptured(event: Event): void
    {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
    }
}
