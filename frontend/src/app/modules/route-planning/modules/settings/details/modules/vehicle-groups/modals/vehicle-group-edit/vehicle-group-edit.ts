import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { Log } from "shared/infrastructure";
import { VehicleGroup } from "app/model/_route-planning-settings";
import { VehicleType } from "app/model/vehicle";

@autoinject
export class VehicleGroupPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param addressService The `AddressService` instance.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private _result: VehicleGroup | undefined;
    private _modal: Modal;

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
    protected vehicleTypes = Object.keys(VehicleType.getAll).map(slug => ({ slug, ...VehicleType.getAll[slug] }));

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

            // Set the result of the modal.
            this._result = this.model.vehicleGroup;
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
