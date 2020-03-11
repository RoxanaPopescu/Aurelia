import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { Log } from "shared/infrastructure";
import { VehicleGroup } from "app/model/_route-planning-settings";
import { VehicleType } from "app/model/vehicle";
import { AddressService } from "app/components/address-input/services/address-service/address-service";

@autoinject
export class VehicleGroupPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param addressService The `AddressService` instance.
     */
    public constructor(modal: Modal, addressService: AddressService)
    {
        this._modal = modal;
        this._addressService = addressService;
    }

    private _result: VehicleGroup | undefined;
    private _modal: Modal;
    private readonly _addressService: AddressService;

    /**
     * True if the model represents a new stop, otherwise false.
     */
    protected isNew: boolean;

    /**
     * The model for the modal.
     */
    protected model: { vehicleGroup: VehicleGroup };

    /**
     * The available vehicle types.
     */
    protected vehicleTypes = VehicleType.getAll();

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { vehicleGroup: VehicleGroup }): void
    {
        this.isNew = (model.vehicleGroup?.id) == null;
        this.model = { vehicleGroup: model.vehicleGroup.clone() };
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<VehicleGroup | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Save" icon is clicked.
     * Saves changes and transitions the modal to its readonly mode.
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

            // Mark the modal as busy.
            this._modal.busy = true;

            // Resolve stop location, if needed.
            if (this.model.vehicleGroup.startLocation != null && this.model.vehicleGroup.startLocation.location.address.id != null)
            {
                try
                {
                    this.model.vehicleGroup.startLocation.location = await this._addressService.getLocation(this.model.vehicleGroup.startLocation.location.address);
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);

                    return;
                }
            }

            // Resolve stop location, if needed.
            if (this.model.vehicleGroup.endLocation != null && this.model.vehicleGroup.endLocation.location.address.id != null)
            {
                try
                {
                    this.model.vehicleGroup.endLocation.location = await this._addressService.getLocation(this.model.vehicleGroup.endLocation.location.address);
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);

                    return;
                }
            }

            this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the route stop", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
