import { autoinject } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Modal } from "shared/framework/services/modal";
import { ListViewDefinition, ListViewType } from "app/model/list-view";

/**
 * Represents the result of a `CreateListViewDialog` instance.
 */
export interface ICreateListViewDialogResult
{
    /**
     * The name of the list view definition.
     */
    name: string;

    /**
     * True if the list view definition is shared with the organization, otherwise false.
     */
    shared: boolean;
}

/**
 * Represents the model for a `CreateListViewDialog` instance.
 */
export interface ICreateListViewDialogModel
{
    /**
     * The type of list view definition to create.
     */
    type: ListViewType;

    /**
     * The existing list view definitions, used for validating name uniqueness.
     */
    listViewDefinitions:
    {
        personal: ListViewDefinition<any>[];
        shared: ListViewDefinition<any>[];
    };
}

/**
 * Represents a modal dialog for creating a new list view.
 */
@autoinject
export class CreateListViewDialog
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
     * The type of list view to create.
     */
    protected type: ListViewType;

    /**
     * The existing list view definitions, used for validating name uniqueness.
     */
    protected listViewDefinitions:
    {
        personal: ListViewDefinition<any>[];
        shared: ListViewDefinition<any>[];
    };

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
    public activate(model: ICreateListViewDialogModel): void
    {
        this.type = model.type;
        this.listViewDefinitions = model.listViewDefinitions;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns An object representing the values provided by the user, or undefined if the dialog was cancelled.
     */
    public async deactivate(): Promise<ICreateListViewDialogResult | undefined>
    {
        if (!this._result)
        {
            return undefined;
        }

        return { name: this.name, shared: this.shared };
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
