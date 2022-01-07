import { autoinject } from "aurelia-framework";
import { AutomaticDispatchConfiguration, AutomaticDispatchService } from "app/model/automatic-dispatch";
import { IValidation, Modal } from "shared/framework";
import { Log } from "shared/infrastructure";

@autoinject
export class ConfigurationPanel
{
    /**
     * Creates a new instance of the class.
     * The `AutomaticDispatchService` instance.
     * @param automaticDispatchService The `AutomaticDispatchService` instance.
     * @param modal The `Modal` instance.
     */
    public constructor(automaticDispatchService: AutomaticDispatchService, modal: Modal)
    {
        this._automaticDispatchService = automaticDispatchService;
        this._modal = modal;
    }

    private readonly _automaticDispatchService: AutomaticDispatchService;
    private readonly _modal: Modal;

    /**
     * The model to change.
     */
    protected model: AutomaticDispatchConfiguration;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the module is activated.
     */
    public async activate(): Promise<void>
    {
        this._modal.busy = true;

        try
        {
            this.model = await this._automaticDispatchService.getConfiguration();
            this._modal.busy = false;
        }
        catch (error)
        {
            Log.error("Could not get the configuration", error);
            await this._modal.close();
        }
    }

    /**
     * Called when the 'save' button is clicked and we want to save the configuration
     */
    protected async onSaveClick(): Promise<void>
    {
        try
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            this._modal.busy = true;

            await this._automaticDispatchService.saveConfiguration(this.model);

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the order", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
