import { autoinject } from "aurelia-framework";
import { DriverService, Driver } from "app/model/driver";
import { VehicleService, Vehicle } from "app/model/vehicle";
import { ModalService, IValidation } from "shared/framework";
import { DeleteVehicleDialog } from "app/modules/fleet/modals/confirm-delete/confirm-delete";
import { VehiclePanel } from "app/modules/fleet/modals/vehicle/vehicle";
import { Operation } from "shared/utilities";
import { Log, ApiError } from "shared/infrastructure";
import { DriverStatus } from "app/model/driver/entities/driver-status";
import { ChangePasswordPanel } from "./modals/change-password/change-password";
import { SendMessagePanel } from "../modals/send-message/send-message";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The ID of the driver, or undefined if new.
     */
    id?: string;
}

/**
 * Represents the module.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param vehicleService The `VehicleService` instance.
     * @param driverService The `DriverService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(vehicleService: VehicleService, driverService: DriverService, modalService: ModalService)
    {
        this._vehicleService = vehicleService;
        this._driverService = driverService;
        this._modalService = modalService;
        this._constructed = true;
    }

    private readonly _vehicleService: VehicleService;
    private readonly _driverService: DriverService;
    private readonly _modalService: ModalService;
    private readonly _constructed;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The route planning rule set.
     */
    protected driver: Driver;

    /**
     * True if the route planning rule set is new, otherwise false.
     */
    protected isNew: boolean;

    /**
     * True if the email or phone number already exist, otherwise false.
     */
    protected emailOrPhoneAlreadyExist: boolean = false;

    /**
     * The items to present in the table.
     */
    protected vehicles: Vehicle[];

    /**
     * True if the rule set is being updated, otherwise false.
     */
    protected updating: boolean = false;

    /**
     * The available statuses for the driver
     */
    protected statuses = Object.keys(DriverStatus.values).map(slug => new DriverStatus(slug as any));

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IRouteParams): Promise<void>
    {
        this.isNew = params.id == null;

        if (!this.isNew)
        {
            this.driver = await this._driverService.get(params.id!);
            this.update();
        }
        else
        {
            this.driver = new Driver();
            this.vehicles = [];
            this.update();
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

        if (this.driver.id == null)
        {
            return;
        }

        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            // Fetch the data.
            const result = await this._vehicleService.getAllFromDriver(this.driver.id, signal);

            // Update the state.
            this.vehicles = result;
        });
    }

    /**
     * Called when the `Add vehicle` button is clicked.
     * Opens a modal for creating a vehicle.
     */
    protected async onChangePasswordClick(): Promise<void>
    {
        await this._modalService.open(ChangePasswordPanel, this.driver).promise;
    }

    /**
     * Called when the `Send message` button is clicked.
     * Opens a modal for sending a message.
     */
    protected async onSendMessageClick(): Promise<void>
    {
        await this._modalService.open(SendMessagePanel, this.driver).promise;
    }

    /**
     * Called when a vehicle is clicked.
     * Opens a modal for editing the vehicle.
     * @param vehicle The vehicle to edit.
     */
    protected async onVehicleClick(vehicle: Vehicle): Promise<void>
    {
        const newVehicle = await this._modalService.open(VehiclePanel, { vehicle: vehicle, driverId: this.driver.id }).promise;

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
        const newVehicle = await this._modalService.open(VehiclePanel, { driverId:  this.driver.id}).promise;

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

    /**
     * Called when the "Save changes" or "Create rule set" button is clicked.
     * Saves the route planning settings.
     */
    protected async onSaveClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;
        this.emailOrPhoneAlreadyExist = false;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        this.updating = true;

        try
        {
            if (this.isNew)
            {
                this.driver = await this._driverService.create(this.driver);
                this.isNew = false;
            }
            else
            {
                this.driver = await this._driverService.update(this.driver);
            }

            this.updating = false;
        }
        catch (error)
        {
            if (error instanceof ApiError && error.response != null && error.response.status === 409)
            {

                this.emailOrPhoneAlreadyExist = true;
            }
            else
            {
                Log.error("Could not save the route planning settings", error);
            }

            this.updating = false;
        }
    }
}
