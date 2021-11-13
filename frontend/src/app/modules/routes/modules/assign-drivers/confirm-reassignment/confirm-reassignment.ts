import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { RouteAssignDriver } from "app/model/route";

@autoinject
export class ConfirmReassignmentDialog
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
    protected current: RouteAssignDriver;
    protected new: RouteAssignDriver;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { new: RouteAssignDriver; current: RouteAssignDriver }): void
    {
        this.new = model.new;
        this.current = model.current;
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

        await this._modal.close();
    }
}