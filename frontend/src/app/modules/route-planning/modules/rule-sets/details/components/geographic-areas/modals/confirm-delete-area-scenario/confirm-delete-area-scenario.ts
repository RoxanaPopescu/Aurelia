import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";

@autoinject
export class ConfirmDeleteAreaScenarioDialog
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
     * The area scenario to delete.
     */
    protected ruleNumber: number;

    /**
     * Called by the framework when the modal is deactivated.
     * @param model The number identifying area scenario to delete.
     */
    public activate(model: number): void
    {
        this.ruleNumber = model;
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
