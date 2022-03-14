import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { VehicleGroup } from "app/model/_route-planning-settings";

@autoinject
export class ConfirmDeleteVehicleGroupDialog
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

    protected vehicleGroup: VehicleGroup;
    protected isReferenced: boolean;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { vehicleGroup: VehicleGroup; isReferenced: boolean }): void
    {
        this.vehicleGroup = model.vehicleGroup;
        this.isReferenced = model.isReferenced;
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
     * Called when one of the buttons are clicked.
     */
    protected async onButtonClick(result: boolean): Promise<void>
    {
        this._result = result;

        await this._modal.close();
    }
}
