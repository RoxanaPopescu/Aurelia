import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";

@autoinject
export class InvalidAssignmentDialog
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
    private readonly _result = false;
    protected issue: string;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: string): void
    {
        this.issue = model;
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
    protected async onButtonClick(): Promise<void>
    {
        await this._modal.close();
    }
}