import { ViewPresetType } from "app/model/view-presets";
import { autoinject } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Modal } from "shared/framework/services/modal";

/**
 * Represents the result returned by a modal dialog for creating a new view preset.
 */
export interface ICreateViewPresetDialogResult
{
    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    shared: boolean;

    /**
     * The name of the view preset.
     */
    name: string;
}

/**
 * Represents a modal dialog for creating a new view preset.
 */
@autoinject
export class CreateViewPresetDialog
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
     * The type of view preset to create.
     */
    protected type: ViewPresetType;

    /**
     * The name to use for the new view preset, or undefined if not yet specified.
     */
    protected model: ICreateViewPresetDialogResult | undefined;

    /**
     * Called by the framework when the modal is deactivated.
     * @param type The type of view preset to create.
     */
    public activate(type: ViewPresetType): void
    {
        this.type = type;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The name provided by the user, or undefined if the dialog was cancelled.
     */
    public async deactivate(): Promise<ICreateViewPresetDialogResult | undefined>
    {
        if (!this._result)
        {
            return undefined;
        }

        return this.model;
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
