import { inject, bindable, Optional } from "aurelia-framework";
import { Modal, ModalService } from "../../../services/modal";

/**
 * Represents the backdrop for a modal.
 *
 * ### How to use:
 * Place directly within the `template` element of the modal,
 * before its content.
 */
@inject(ModalService, Optional.of(Modal, true))
export class ModalBackdropCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modalService The `ModalService`instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(modalService: ModalService, modal?: Modal)
    {
        this._modalService = modalService;
        this._modal = modal;
    }

    private readonly _modalService: ModalService;
    private readonly _modal: Modal | undefined;

    /**
     * True to close the modal on when the backdrop is clicked, false to do nothing, or the name of a modal group to
     * The modal close action to take when the overlay is clicked, where 'top' attempts to close
     * the modal at the top, 'all' attempts to close all modals, and 'none' does nothing.
     * The default is 'top'.
     */
    @bindable({ defaultValue: "top" })
    public close: "top" | "all" | "none";

    /**
     * Called when the backdrop is clicked.
     */
    protected async onClick(): Promise<void>
    {
        const topModal = this._modalService.modals[this._modalService.modals.length - 1];

        if (this._modal && this._modal === topModal)
        {
            if (this.close === "all")
            {
                await this._modalService.closeAll("backdrop-clicked");
            }
            else if (this.close === "top")
            {
                await this._modal.close("backdrop-clicked");
            }
        }
    }
}
