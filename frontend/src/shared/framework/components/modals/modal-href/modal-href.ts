import { autoinject, bindable } from "aurelia-framework";
import { ModalService, Modal } from "../../../services/modal";

import "./modal-href.scss";

/**
 * Custom attribute that makes the element to which it is applied
 * open or toggle the specified modal when clicked.
 *
 * ### How to use:
 * Place on the element that should open or toggle a modal when clicked,
 * and specify the modal to open in the options.
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
        this._element = element as HTMLElement;
        this._modalService = modalService;
    }

    private readonly _element: HTMLElement;
    private readonly _modalService: ModalService;
    private _modal: Modal | undefined;

    /**
     * The name of the modal to launch, or undefined to do nothing.
     * Note that the modal must be registered with the `ModalService`,
     * otherwise an error will be thrown when the element is clicked.
     */
    @bindable
    public modal?: string;

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
        this._element.addEventListener("click", event =>
        {
            if (!event.defaultPrevented)
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
    private async onElementClick(event: MouseEvent): Promise<void>
    {
        // Don't handle the event if it originated from an anchor with an href nested inside the element.
        if (event.target !== this._element && event.target instanceof HTMLAnchorElement && event.target.hasAttribute("href"))
        {
            return;
        }

        // Don't handle the event if default has been prevented.
        if (event.defaultPrevented)
        {
            return;
        }

        event.preventDefault();

        if (!this.modal)
        {
            return;
        }

        try
        {
            if (this.toggle && this._modal != null)
            {
                await this._modal.close();
            }
            else
            {
                this._modal = this._modalService.open(this.modal);
                await this._modal.promise;
            }
        }
        finally
        {
            this._modal = undefined;
        }
    }
}
