import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { Log } from "shared/infrastructure";
import { VehicleGroup, VehicleGroupLocation } from "app/model/_route-planning-settings";
import { VehicleType } from "app/model/vehicle";
import { AddressService } from "app/components/address-input/services/address-service/address-service";
import { Uuid } from "shared/utilities/id/uuid";

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

    private readonly _modal: Modal;
    private readonly _addressService: AddressService;
    private _result: VehicleGroup | undefined;

    /**
     * True if the model represents a new stop, otherwise false.
     */
    protected isNew: boolean;

    /**
     * The model for the modal.
     */
    protected model: VehicleGroup;

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
    public activate(model: VehicleGroup): void
    {
        this.isNew = model.id == null;
        this.model = model.clone();

        if (this.model.startLocation == null)
        {
            this.model.startLocation = new VehicleGroupLocation();
        }

        if (this.model.endLocation == null)
        {
            this.model.endLocation = new VehicleGroupLocation();
        }
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

            // Clear start location if no address is specified.
            if (this.model.startLocation!.location.address == null)
            {
                this.model.startLocation = undefined;
            }

            // Resolve start location, if needed.
            if (this.model.startLocation != null && this.model.startLocation.location.address.id != null)
            {
                try
                {
                    this.model.startLocation.location = await this._addressService.getLocation(this.model.startLocation.location.address);
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);

                    return;
                }
            }

            // Clear end location if no address is specified.
            if (this.model.endLocation!.location.address == null)
            {
                this.model.endLocation = undefined;
            }

            // Resolve end location, if needed.
            if (this.model.endLocation != null && this.model.endLocation.location.address.id != null)
            {
                try
                {
                    this.model.endLocation.location = await this._addressService.getLocation(this.model.endLocation.location.address);
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);

                    return;
                }
            }

            if (this.model.id == null)
            {
                this.model.id = Uuid.v1();
            }

            this._result = this.model;

            await this._modal.close();
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
