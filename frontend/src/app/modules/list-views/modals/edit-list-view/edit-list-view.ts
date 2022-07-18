import { autoinject } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Modal } from "shared/framework/services/modal";
import { ListViewDefinition } from "app/model/list-view";

/**
 * Represents the model for a `EditListViewDialog` instance.
 */
export interface IEditListViewDialogModel
{
    /**
     * The existing list view definitions, used for validating name uniqueness.
     */
    listViewDefinitions:
    {
        personal: ListViewDefinition<any>[];
        shared: ListViewDefinition<any>[];
    };

    /**
     * The list view definition to edit ro create.
     */
    listViewDefinition: ListViewDefinition<any>;
}

/**
 * Represents a modal dialog for editing or creating a list view.
 */
@autoinject
export class EditListViewDialog
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
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The existing list view definitions, used for validating name uniqueness.
     */
    protected listViewDefinitions:
    {
        personal: ListViewDefinition<any>[];
        shared: ListViewDefinition<any>[];
    };

    /**
     * The list view definition to edit ro create.
     */
    protected listViewDefinition: ListViewDefinition<any>;

    /**
     * The name of the list view definition.
     */
    protected name: string;

    /**
     * True if the list view definition is shared with the organization, otherwise false.
     */
    protected shared = false;

    /**
     * Called by the framework when the modal is deactivated.
     * @param model The model to use for the modal.
     */
    public activate(model: IEditListViewDialogModel): void
    {
        this.listViewDefinitions = model.listViewDefinitions;
        this.listViewDefinition = model.listViewDefinition;
        this.name = model.listViewDefinition.name;
        this.shared = model.listViewDefinition.shared;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns True if the changes should be comitted, or false if the dialog was cancelled.
     */
    public async deactivate(): Promise<boolean>
    {
        if (this._result)
        {
            this.listViewDefinition.name = this.name;
            this.listViewDefinition.shared = this.shared;
        }

        return this._result;
    }

    /**
     * Called when one of the buttons are clicked.
     */
    protected async onButtonClick(result: boolean): Promise<void>
    {
        if (result)
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }
        }

        this._result = result;

        await this._modal.close();
    }
}
