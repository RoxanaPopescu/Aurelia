import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { AutoContractorAssignmentRule } from "app/model/auto-contractor-assignment";

@autoinject
export class ConfirmDeleteAreaDialog
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
     * The area to delete.
     */
    protected area: AutoContractorAssignmentRule;

    /**
     * Called by the framework when the modal is deactivated.
     * @param model The area to delete.
     */
    public activate(model: AutoContractorAssignmentRule): void
    {
        this.area = model;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The result of the modal.
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
