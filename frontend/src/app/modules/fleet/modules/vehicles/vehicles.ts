import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { Vehicle, VehicleService } from "app/model/vehicle";
import { DeleteVehicleDialog } from "../../modals/confirm-delete/confirm-delete";
import { VehiclePanel } from "../../modals/vehicle/vehicle";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param vehicleService The `VehicleService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(vehicleService: VehicleService, modalService: ModalService)
    {
        this._vehicleService = vehicleService;
        this._modalService = modalService;
        this._constructed = true;
    }

    private readonly _vehicleService: VehicleService;
    private readonly _modalService: ModalService;
    private readonly _constructed;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected driverCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected vehicles: Vehicle[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(): void
    {
        this.update();
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }
    }

    /**
     * Updates the page by fetching the latest data.
     */
    protected update(): void
    {
        // Return if the object is not constructed.
        // This is needed because the `observable` decorator calls the change handler when the
        // initial property value is set, which happens before the constructor is called.
        if (!this._constructed)
        {
            return;
        }

        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            // Fetch the data.
            const result = await this._vehicleService.getAll(undefined, signal);

            // Update the state.
            this.vehicles = result;

            // Scroll to top.
            this.scroll?.reset();
        });
    }

    /**
     * Called when a vehicle is clicked.
     * Opens a modal for editing the vehicle.
     * @param vehicle The vehicle to edit.
     */
    protected async onVehicleClick(vehicle: Vehicle): Promise<void>
    {
        const newVehicle = await this._modalService.open(VehiclePanel, { vehicle: vehicle }).promise;

        if (newVehicle != null)
        {
            this.vehicles.splice(this.vehicles.indexOf(vehicle), 1, newVehicle);

            this.update();
        }
    }

    /**
     * Called when the `Add vehicle` button is clicked.
     * Opens a modal for creating a vehicle.
     */
    protected async onAddVehicleClick(): Promise<void>
    {
        const newVehicle = await this._modalService.open(VehiclePanel).promise;

        if (newVehicle != null)
        {
            this.vehicles.push(newVehicle);
        }

        this.update();
    }

    /**
     * Called when the `Remove vehicle` icon is clicked on a vehicle.
     * Asks the user to confirm, then deletes the stop from the route.
     * @param vehicle The vehicle to remove.
     */
    protected async onRemoveVehicleClick(vehicle: Vehicle): Promise<void>
    {
        const confirmed = await this._modalService.open(DeleteVehicleDialog, vehicle).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._vehicleService.delete(vehicle.id);

            this.vehicles.splice(this.vehicles.indexOf(vehicle), 1);
        }
        catch (error)
        {
            Log.error("Could not remove the vehicle", error);
        }
    }
}
