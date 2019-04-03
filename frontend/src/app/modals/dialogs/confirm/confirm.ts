import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";

@autoinject
export class ConfirmDialogCustomElement
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
     * Called by the framework when the modal is activated.
     * @param model The model to use for the modal.
     */
    public activate(model: any): void
    {
        console.log("activate", model);
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The result of the modal.
     */
    public deactivate(): boolean
    {
        console.log("deactivate", this._result);

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
