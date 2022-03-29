import { autoinject } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Modal } from "shared/framework/services/modal";
import { ViewPreset, ViewPresetType } from "app/model/view-presets";

/**
 * Represents the result of a `CreateViewPresetDialog` instance.
 */
export interface ICreateViewPresetDialogResult
{
    /**
     * The name of the view preset.
     */
    name: string;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    shared: boolean;
}

/**
 * Represents the model for a `CreateViewPresetDialog` instance.
 */
export interface ICreateViewPresetDialogModel
{
    /**
     * The type of view preset to create.
     */
    type: ViewPresetType;

    /**
     * The existing shared presets, used for validating name uniqueness.
     */
    sharedPresets: ViewPreset[];

    /**
     * The existing local presets, used for validating name uniqueness.
     */
    localPresets: ViewPreset[]
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
     * The existing shared presets, used for validating name uniqueness.
     */
    protected sharedPresets: ViewPreset[];

    /**
     * The existing local presets, used for validating name uniqueness.
     */
    protected localPresets: ViewPreset[];

    /**
     * The name of the view preset.
     */
    protected name: string;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    protected shared = false;

    /**
     * Called by the framework when the modal is deactivated.
     * @param type The type of view preset to create.
     */
    public activate(model: ICreateViewPresetDialogModel): void
    {
        this.type = model.type;
        this.sharedPresets = model.sharedPresets;
        this.localPresets = model.localPresets;
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
