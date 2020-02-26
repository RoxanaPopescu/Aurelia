import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { RouteStopBase } from "app/model/route";

@autoinject
export class AddSupportNoteDialog
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
    private note?: string;

    protected stop: RouteStopBase;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: RouteStopBase): void
    {
        this.stop = model;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns True if the stop should be cancelled, otherwise false.
     */
    public deactivate(): boolean
    {
        return this._result;
    }

    /**
     * Called when one of the buttons are clicked.
     */
    protected async onButtonClick(result: boolean): Promise<void>
    {
        this._result = result;

        await this._modal.close(this.note);
    }
}
