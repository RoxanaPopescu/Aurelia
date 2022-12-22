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

        // Listen for events that should trigger navigation.

        this._element.addEventListener("click", (event: MouseEvent) =>
        {
            // tslint:disable-next-line: no-floating-promises
            this.onElementClick(event);
        });

        this._element.addEventListener("keydown", (event: KeyboardEvent) =>
        {
            // Handle the event as a click if the `Enter` key is pressed.
            if (event.key === "Enter")
            {
                // tslint:disable-next-line: no-floating-promises
                this.onElementClick(event);
            }
        });
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
    public modal: string | undefined;

    /**
     * The model to pass to the `activate` life cycle method of the component.
     */
    @bindable
    public model: any;

    /**
     * True to toggle between opening and closing the modal, false to always open the modal.
     * The default is false.
     */
    @bindable({ defaultValue: false })
    public toggle: boolean;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        // Ensure this attribute is set.
        this.setThisAttribute();
    }

    /**
     * Called by the framework when the `modal` property changes.
     */
    protected modalChanged(): void
    {
        // Ensure this attribute is updated.
        this.setThisAttribute();
    }

    /**
     * Called by the framework when the `toggle` property changes.
     */
    protected toggleChanged(): void
    {
        // Ensure this attribute is updated.
        this.setThisAttribute();
    }

    /**
     * Called when the element is clicked.
     * Opens or toggles the specified modal.
     */
    private async onElementClick(event: Event): Promise<void>
    {
        // Don't handle the event if default has been prevented or it is being repeated.
        if (event.defaultPrevented || (event instanceof MouseEvent && event.detail > 1) || (event instanceof KeyboardEvent && event.repeat))
        {
            return;
        }

        // Don't handle the event if it originated from a nested anchor element with an `href` attribute.
        for (const target of event.composedPath())
        {
            // Only consider targets within the current element.
            if (target === this._element)
            {
                break;
            }

            // Determine whether the target is an anchor element with an `href`.
            if (target instanceof HTMLAnchorElement && target.hasAttribute("href"))
            {
                return;
            }
        }

        // Do nothing if no modal is specified.
        if (this.modal == null)
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

    /**
     * Set this attribute on the element.
     */
    private setThisAttribute(): void
    {
        let attributeName: string;

        // Remove all variations of this attribute.

        for (attributeName of this._element.getAttributeNames())
        {
            if (/^modal-href(?:\.|$)/.test(attributeName))
            {
                this._element.removeAttribute(attributeName);
            }
        }

        // Set this attribute, such that it can be used to style the element based on the attribute options.

        let attributeValue = "";

        if (this.modal)
        {
            attributeValue += `modal: ${this.modal}`;
        }

        if (this.model !== undefined)
        {
            attributeValue += "model: …";
        }

        if (this.toggle != null)
        {
            attributeValue += `; toggle: ${this.toggle}`;
        }

        this._element.setAttribute("modal-href", attributeValue);
    }
}
