import { autoinject, computedFrom } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Operation } from "shared/utilities";
import { Modal } from "shared/framework";
import { RouteAssignmentService, Route } from "app/model/route";
import { VehicleService, Vehicle } from "app/model/vehicle";

@autoinject
export class AssignVehiclePanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param vehicleService The `VehicleService` instance.
     */
    public constructor(modal: Modal, routeAssignmentService: RouteAssignmentService, vehicleService: VehicleService)
    {
        this._modal = modal;
        this._routeAssignmentService = routeAssignmentService;
        this._vehicleService = vehicleService;
    }

    private readonly _modal: Modal;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _vehicleService: VehicleService;
    private _result: Vehicle | undefined;

    /**
     * The searchg query, or undefined if ne search query is entered.
     */
    protected queryText: string | undefined;

    /**
     * The route to which a driver should be assigned.
     */
    protected route: Route;

    /**
     * The available drivers.
     */
    protected vehicles: Vehicle[] | undefined;

    /**
     * The selected driver.
     */
    protected vehicle: Vehicle | undefined;

    /**
     * The available drivers, filtered to include only those matching the route requirements and query text.
     */
    @computedFrom("vehicles", "queryText")
    protected get filteredResults(): Vehicle[] | undefined
    {
        if (this.vehicles == null)
        {
            return undefined;
        }

        if (!this.queryText)
        {
            return this.vehicles;
        }

        const text = this.queryText.toLowerCase();

        return this.vehicles

            .filter(d =>
                d.id.toString().includes(text) ||
                d.name?.toLowerCase().includes(text) ||
                d.make.toLowerCase().includes(text) ||
                d.model.toLowerCase().includes(text) ||
                d.status.name.toLowerCase().includes(text));
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: Route): void
    {
        this.route = model;

        // tslint:disable-next-line: no-unused-expression
        new Operation(async () =>
        {
            this.vehicles = await this._vehicleService.getAll(
                { status: "approved", minimumVehicleType: this.route.vehicleType }
            );
        });
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected vehicle, or undefined if cancelled.
     */
    public async deactivate(): Promise<Vehicle | undefined>
    {
        return this._result;
    }

    /**
     * Called when a vehicle in the list of vehicle is clicked.
     * Assigns the vehicle to the route and closes the modal.
     */
    protected async onSelect(vehicle: Vehicle): Promise<void>
    {
        try
        {
            this._modal.busy = true;

            await this._routeAssignmentService.assignVehicle(this.route, vehicle);

            this._result = vehicle;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not assign the vehicle", error);
            this._modal.busy = false;
        }
    }
}
