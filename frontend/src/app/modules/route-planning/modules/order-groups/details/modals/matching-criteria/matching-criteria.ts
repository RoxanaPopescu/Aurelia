import { autoinject } from "aurelia-framework";
import { Modal, IValidation } from "shared/framework";
import { MatchingCriteria } from "app/model/order-group";
import { Consignor } from "app/model/outfit";

interface IModel
{
    matchingCriteria: MatchingCriteria;
    tags: string[];
    consignors: Consignor[];
}

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
    private result = false;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    protected model: IModel;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use for the modal.
     */
    public activate(model: IModel): void
    {
        this.model = model;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns True if the changes should be saved, false if the dialog was cancelled.
     */
    public deactivate(): boolean
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

        this.result = true;
        await this._modal.close();
    }
}
