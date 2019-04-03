import { autoinject, bindable } from "aurelia-framework";
import { Modal } from "../../../services/modal";

/**
 * Represents the backdrop for a modal.
 *
 * ### How to use:
 * Place directly within the `template` element of the modal,
 * before its content.
 */
@autoinject
export class ModalBackdropCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;

    /**
     * True to close the modal when the backdrop is clicked, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeModal: boolean;

    /**
     * Called when the backdrop is clicked.
     */
    protected async onClick(): Promise<void>
    {
        if (this.closeModal)
        {
            await this._modal.close();
        }
    }
}
