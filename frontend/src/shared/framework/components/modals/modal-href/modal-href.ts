import { autoinject, bindable } from "aurelia-framework";
import { ModalService, Modal } from "../../../services/modal";

import "./modal-href.scss";

/**
 * Custom attribute that makes the element to which it is applied
 * open or toggle the specified modal when clicked.
 */
@autoinject
export class ModalHrefCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which the attribute is attached.
     * @param modalService The `ModalService` instance.
     */
    public constructor(element: Element, modalService: ModalService)
    {
        this._element = element as HTMLElement | SVGElement;
        this._modalService = modalService;
    }

    private readonly _element: HTMLElement | SVGElement;
    private readonly _modalService: ModalService;
    private _modal: Modal | undefined;

    /**
     * The name of the modal to launch, or undefined to do nothing.
     * Note that the modal must be registered with the `ModalService`,
     * otherwise an error will be thrown when the element is clicked.
     */
    @bindable({ primaryProperty: true })
    public modal?: string;

    /**
     * The model to pass to the `activate` life cycle method of the component.
     */
    @bindable
    public readonly model?: any;

    /**
     * True to toggle between opening and closing the modal, false to always open the modal.
     * The default is false.
     */
    @bindable({ defaultValue: false })
    public toggle: boolean;

    /**
     * Called by the framework when the element is attached.
     */
    public attached(): void
    {
        // Listen for events that should trigger navigation.

        this._element.addEventListener("click", (event: MouseEvent) =>
        {
            // tslint:disable-next-line: no-floating-promises
            this.onElementClick(event);
        });

        this._element.addEventListener("keydown", (event: KeyboardEvent) =>
        {
            // Ignore the event if any modifier key is pressed.
            if (!event.key || event.key.length > 1 || event.metaKey || event.ctrlKey)
            {
                return;
            }

            // Handle the event as a click if the `Enter` key is pressed.
            if (event.key === "Enter")
            {
                // tslint:disable-next-line: no-floating-promises
                this.onElementClick(event);
            }
        });
    }

    /**
     * Called when the element is clicked.
     * Opens or toggles the specified modal.
     */
    private async onElementClick(event: Event): Promise<void>
    {
        // Don't handle the event if default has been prevented.
        if (event.defaultPrevented)
        {
            return;
        }

        // Don't handle the event if it originated from an anchor with an href nested inside the element.
        if (event.target !== this._element && event.target instanceof HTMLAnchorElement && event.target.hasAttribute("href"))
        {
            return;
        }

        // Do nothing if no modal is specified.
        if (!this.modal)
        {
            return;
        }

        // Prevent default for the event, as it will be handled by this attribute.
        event.preventDefault();

        // Open or toggle the modal.

        try
        {
            if (this.toggle && this._modal != null)
            {
                await this._modal.close();
            }
            else
            {
                this._modal = this._modalService.open(this.modal, this.model);

                await this._modal.promise;
            }
        }
        finally
        {
            this._modal = undefined;
        }
    }
}
