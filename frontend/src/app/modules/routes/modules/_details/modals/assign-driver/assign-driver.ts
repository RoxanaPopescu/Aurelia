import { autoinject, computedFrom } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { RouteAssignmentService, Route } from "app/model/route";
import { Driver, DriverService } from "app/model/driver";
import { Operation } from "shared/utilities";

@autoinject
export class AssignDriverPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteAssignmentService` instance.
     * @param driverService The `DriverService` instance.
     */
    public constructor(routeService: RouteAssignmentService, driverService: DriverService)
    {
        this._routeAssignmentService = routeService;
        this._driverService = driverService;
    }

    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _driverService: DriverService;
    private _result: Driver | undefined;

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
    protected drivers: Driver[] | undefined;

    /**
     * The selected driver.
     */
    protected driver: Driver | undefined;

    /**
     * The available drivers, filtered to include only those matching the route requirements and query text.
     */
    @computedFrom("drivers", "queryText")
    protected get filteredDrivers(): Driver[] | undefined
    {
        if (this.drivers == null)
        {
            return undefined;
        }

        if (!this.queryText)
        {
            return this.drivers;
        }

        const text = this.queryText.toLowerCase();

        return this.drivers

            .filter(d =>
                d.vehicleTypes != null && d.vehicleTypes.some(vt => vt.slug === this.route.vehicleType.slug))

            .filter(d =>
                d.id.toString().includes(text) ||
                d.name.toString().toLowerCase().includes(text) ||
                d.phone.toString().toLowerCase().includes(text));
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
            const driversRespnse = await this._driverService.getAll();
            this.drivers = driversRespnse.drivers;
        });
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected driver, or undefined if cancelled.
     */
    public async deactivate(): Promise<Driver | undefined>
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
            await this._routeAssignmentService.assignDriver(this.route, this.driver!);

            this.route.driver = this.driver;
            this._result = this.driver;
        }
        catch (error)
        {
            Log.error("Could not assign driver", error);
        }
    }
}
