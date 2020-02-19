import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { VehicleService, Vehicle, VehicleType } from "app/model/vehicle";

@autoinject
export class VehiclePanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param vehicleService The `VehicleService` instance.
     */
    public constructor(modal: Modal, vehicleService: VehicleService)
    {
        this._modal = modal;
        this._vehicleService = vehicleService;
    }

    private readonly _modal: Modal;
    private readonly _vehicleService: VehicleService;
    private _result: Vehicle | undefined;

    /**
     * The vehicle being edited or created.
     */
    protected vehicle: Vehicle | undefined;

    /**
     * The available vehicle types.
     */
    protected vehicleTypes: VehicleType[];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The vehicle to edit, or undefined to create a new vehicle.
     */
    public async activate(model?: Vehicle): Promise<void>
    {
        this.vehicleTypes = await this._vehicleService.getTypes();

        this.vehicle = model ?? new Vehicle();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited vehicle, or undefined if cancelled.
     */
    public async deactivate(): Promise<Vehicle | undefined>
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
     * Called when the "Save" or "Create" button is clicked.
     * Saves or creates the vehicle, then closes the modal.
     */
    protected async onSaveOrCreateClick(): Promise<void>
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

            if (this.vehicle!.id == null)
            {
                await this._vehicleService.createDetached(this.vehicle!);
            }
            else
            {
                await this._vehicleService.saveDetached(this.vehicle!);
            }

            this._result = this.vehicle;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the vehicle", error);
        }
    }
}
