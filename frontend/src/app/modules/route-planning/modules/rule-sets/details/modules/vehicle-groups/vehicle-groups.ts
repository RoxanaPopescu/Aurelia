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
     * The route planning rule set.
     */
    @bindable
    public settings: RoutePlanningSettings;

    /**
     * Called when the `Remove vehicle group` icon is clicked on a vehicle group.
     * Asks the user to confirm, then deletes the vehicle group from the list.
     * @param vehicleGroup The vehicle group to remove.
     */
    protected async onRemoveVehicleGroupClick(vehicleGroup: VehicleGroup): Promise<void>
    {
        const isReferenced = this.isVehicleGroupReferenced(vehicleGroup.id);

        const confirmed = await this._modalService.open(ConfirmDeleteVehicleGroupDialog, { vehicleGroup, isReferenced }).promise;

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
            const index = this.settings.vehicleGroups.findIndex(g => g.id === savedVehicleGroup.id);

            if (index >= 0)
            {
                this.settings.vehicleGroups.splice(index, 1, savedVehicleGroup);
            }
        }
    }

    /**
     * Determines whether the specified vehicle group is referenced by another entity.
     * @param vehicleGroupId The ID of the vehicle group for which to look for references.
     * @returns True if the specified vehicle group is referenced by another entity, otherwise false.
     */
    protected isVehicleGroupReferenced(vehicleGroupId: string): boolean
    {
        return this.settings.departureTimes.some(dt => dt.scenarios.some(s => s.gates[0].slots[0].vehicleGroup === vehicleGroupId));
    }
}
