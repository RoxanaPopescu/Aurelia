import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { TaskTimesRoundDefinition } from "app/model/_route-planning-settings";

@autoinject
export class RoundDefinitionPanel
{
    /**
     * Creates a new instance of the class.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private _result: TaskTimesRoundDefinition | undefined;

    /**
     * The model for the modal.
     */
    protected model: TaskTimesRoundDefinition;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model for the modal, or undefined if creating a new entity.
     */
    public activate(model: TaskTimesRoundDefinition): void
    {
        this.model = model != null ? model.clone() : new TaskTimesRoundDefinition();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The model for the modal, or undefined if cancelled.
     */
    public async deactivate(): Promise<TaskTimesRoundDefinition | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Save changes" icon or the "Create task time rule" button is clicked.
     * Closes the modal and returns the model.
     */
    protected async onSaveClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        this._result = this.model;

        await this._modal.close();
    }
}
