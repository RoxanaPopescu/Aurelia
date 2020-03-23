import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { TaskTimesScenario } from "app/model/_route-planning-settings";

@autoinject
export class AdditionalTaskTimePanel
{
    /**
     * Creates a new instance of the class.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private _result: TaskTimesScenario | undefined;

    /**
     * True if the model represents a new entity, otherwise false.
     */
    protected isNew: boolean;

    /**
     * The model for the modal.
     */
    protected model: TaskTimesScenario;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model for the modal, or undefined if creating a new entity.
     */
    public activate(model?: TaskTimesScenario): void
    {
        this.isNew = model == null;
        this.model = model != null ? model.clone() : new TaskTimesScenario();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The model for the modal, or undefined if cancelled.
     */
    public async deactivate(): Promise<TaskTimesScenario | undefined>
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
