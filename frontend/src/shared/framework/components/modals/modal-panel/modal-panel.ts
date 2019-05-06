import { inject, bindable, Optional } from "aurelia-framework";
import { Modal } from "../../../services/modal";

/**
 * Represents a modal panel to be presented in the `modal-view`.
 *
 * ### How to use:
 * Place directly within the `template` element for the panel view.
 * When scoping styles, use a selector such as `modal-panel[name="example"]`.
 */
@inject(Element, Optional.of(Modal, true))
export class ModalPanelCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(element: Element, modal?: Modal)
    {
        this.element = element as HTMLElement;
        this.modal = modal;
    }

    /**
     * The element representing the component.
     */
    protected readonly element: HTMLElement;

    /**
     * The `Modal` instance representing the modal.
     */
    protected readonly modal: Modal | undefined;

    /**
     * The name of the panel.
     * Note that this should be unique among the panels in the app.
     */
    @bindable
    public name: string;

    /**
     * True to show a close button and close on outside click, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeButton: boolean;

    /**
     * True to close when the `Escape` key is pressed, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeShortcut: boolean;

    /**
     * Called when the close button is clicked.
     */
    protected onCloseClick(): void
    {
        if (this.modal != null)
        {
            // tslint:disable-next-line: no-floating-promises
            this.modal.close();
        }
    }

    /**
     * Called when a key is pressed.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        if (event.key === "Escape" && this.closeShortcut && this.modal != null)
        {
            // tslint:disable-next-line: no-floating-promises
            this.modal.close();

            return false;
        }
        else
        {
            return true;
        }
    }
}
