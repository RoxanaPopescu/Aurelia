import { autoinject } from "aurelia-framework";
import { Modal, ModalCloseReason } from "shared/framework";

/**
 * Represents a modal dialog that asks for confirmation
 * that the users account should be deleted.
 */
@autoinject
export class AccountDeleteModalDialog
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
    private _result = false;

    /**
     * Called by the framework when the modal is deactivating.
     * @param reason The reason for closing the modal.
     * @returns The result of the modal.
     */
    public deactivate(reason?: ModalCloseReason): boolean
    {
        if (![undefined, "backdrop-clicked"].includes(reason))
        {
            // tslint:disable-next-line: no-string-throw
            throw "This dialog should only close when the user makes a choice or cancels.";
        }

        return this._result;
    }

    /**
     * Called when one of the buttons are clicked.
     */
    protected async onButtonClick(result: boolean): Promise<void>
    {
        this._result = result;

        await this._modal.close();
    }
}
