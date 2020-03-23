import { autoinject, bindable } from "aurelia-framework";
import { RoutePlanningSettings, VehicleGroup } from "app/model/_route-planning-settings";
import { ConfirmDeleteVehicleGroupDialog } from "./modals/confirm-delete-vehicle-group/confirm-delete-vehicle-group";
import { VehicleGroupPanel } from "./modals/vehicle-group-edit/vehicle-group-edit";
import { ModalService } from "shared/framework";

/**
 * Represents the page.
 */
@autoinject
export class VehicleGroups
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        this._modalService = modalService;
    }

    private readonly _modalService: ModalService;

    /**
     * The id of the routeplan settings
     */
    @bindable
    protected settings: RoutePlanningSettings;

    /**
     * Called when the `Remove vehicle group` icon is clicked on a vehicle group.
     * Asks the user to confirm, then deletes the vehicle group from the list.
     * @param vehicleGroup The vehicle group to remove.
     */
    protected async onRemoveVehicleGroupClick(vehicleGroup: VehicleGroup): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeleteVehicleGroupDialog, vehicleGroup).promise;

        if (!confirmed)
        {
            return;
        }

        this.settings.vehicleGroups.splice(this.settings.vehicleGroups.indexOf(vehicleGroup), 1);
    }

    /**
     * Called when the `Create vehicle group` button is clicked on the page.
     */
    protected async onCreateVehicleGroupClick(): Promise<void>
    {
        const vehicleGroup = new VehicleGroup();
        const savedVehicleGroup = await this._modalService.open(VehicleGroupPanel, vehicleGroup).promise;

        if (savedVehicleGroup == null)
        {
            return;
        }

        this.settings.vehicleGroups.push(savedVehicleGroup);
    }

    /**
     * Called when a vehicle group is clicked.
     * Opens a modal showing the details of the vehicle group.
     * @param vehicleGroup The vehicle group to edit.
     */
    protected async onVehicleGroupClick(vehicleGroup: VehicleGroup): Promise<void>
    {
        const savedVehicleGroup = await this._modalService.open(VehicleGroupPanel, vehicleGroup).promise;

        if (savedVehicleGroup != null)
        {
            this.settings.vehicleGroups[this.settings.vehicleGroups.indexOf(vehicleGroup)] = savedVehicleGroup;
        }
    }
}
