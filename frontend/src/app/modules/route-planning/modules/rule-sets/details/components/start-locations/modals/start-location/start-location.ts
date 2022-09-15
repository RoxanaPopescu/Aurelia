import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { DepartureTime, RoutePlanningSettings } from "app/model/_route-planning-settings";
import { IValidation } from "shared/framework";
import { Log } from "shared/infrastructure";
import { AddressService } from "app/components/address-input/services/address-service/address-service";

@autoinject
export class StartLocationDialog
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param addressService The `AddressService` instance.
     */
    public constructor(modal: Modal, addressService: AddressService)
    {
        this._modal = modal;
        this._addressService = addressService;
    }

    private readonly _addressService: AddressService;
    private readonly _modal: Modal;
    private _result: DepartureTime | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    protected model: { settings: RoutePlanningSettings; departureTime: DepartureTime; isNew: boolean };

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The departure time saved, undefined if the user cancels.
     */
    public deactivate(): DepartureTime | undefined
    {
        return this._result;
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { settings: RoutePlanningSettings; departureTime: DepartureTime; isNew: boolean }): void
    {
        this.model = { settings: model.settings, departureTime: model.departureTime.clone(), isNew: model.isNew };
    }

    /**
     * Called when the "Cancel" icon is clicked.
     * Closes the modal.
     */
    protected async onCancelClick(): Promise<void>
    {
        await this._modal.close();
    }

    /**
     * Called when the "Save" icon is clicked.
     * Saves changes and closes the modal.
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

            // Resolve start location, if needed.
            if (this.model.departureTime.startLocation.address.id != null)
            {
                try
                {
                    this.model.departureTime.startLocation = await this._addressService.getLocation(this.model.departureTime.startLocation.address);
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);

                    return;
                }
            }

            // Set the result of the modal.
            this._result = this.model.departureTime;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the start location", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
