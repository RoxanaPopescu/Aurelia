import { autoinject } from "aurelia-framework";
import { Modal, IValidation } from "shared/framework";
import { MatchingCriteria } from "app/model/_order-group";

@autoinject
export class MatchingCriteriaDialog
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
    private result: MatchingCriteria | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    protected model: MatchingCriteria;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use for the modal.
     */
    public activate(model?: MatchingCriteria): void
    {
        this.model = model || new MatchingCriteria();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The matching criteria, or undefined if the dialog was cancelled.
     */
    public deactivate(): MatchingCriteria | undefined
    {
        return this.result;
    }

    /**
     * Called when the save button is clicked.
     */
    protected async onSaveClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        this.result = this.model;
        await this._modal.close();
    }
}
