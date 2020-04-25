import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { Driver, DriverService } from "app/model/driver";
import { IValidation } from "shared/framework";
import { Log } from "shared/infrastructure";

@autoinject
export class ChangePasswordPanel
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param driverService The `DriverService` instance.
     */
    public constructor(modal: Modal, driverService: DriverService)
    {
        this._modal = modal;
        this._driverService = driverService;
    }

    private readonly _modal: Modal;
    private readonly _driverService: DriverService;
    private _result = false;
    protected driver: Driver;

    /**
     * The new password for the driver
     */
    protected newPassword: string;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: Driver): void
    {
        this.driver = model;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns True if the stop should be cancelled, otherwise false.
     */
    public deactivate(): boolean
    {
        return this._result;
    }

    /**
     * Called when the "Cancel" button is clicked.
     * Discards changes and closes the modal.
     */
    protected async onCancel(): Promise<void>
    {
        await this._modal.close();
    }

    /**
     * Called when the "Change password" button is clicked.
     * Saves or creates the vehicle, then closes the modal.
     */
    protected async onChangePasswordClick(): Promise<void>
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

            await this._driverService.updatePassword(this.driver.id, this.newPassword);
            this._result = true;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not change the password", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
