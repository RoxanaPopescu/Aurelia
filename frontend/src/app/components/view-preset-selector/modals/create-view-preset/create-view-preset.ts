import { autoinject } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Modal } from "shared/framework/services/modal";

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
     * The name to use for the new view preset, or undefined if not yet specified.
     */
    protected name: string | undefined;

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The name provided by the user, or undefined if the dialog was cancelled.
     */
    public async deactivate(): Promise<string | undefined>
    {
        if (!this._result)
        {
            return undefined;
        }

        return this.name;
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
