import { autoinject, computedFrom } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Operation } from "shared/utilities";
import { Modal } from "shared/framework";
import { Driver, DriverService } from "app/model/driver";

@autoinject
export class AssignDriverPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param driverService The `DriverService` instance.
     */
    public constructor(modal: Modal, driverService: DriverService)
    {
        this._modal = modal;
        this._driverService = driverService;
    }

    private readonly _modal: Modal;
    private readonly _driverService: DriverService;
    private _result: Driver | undefined;

    /**
     * The searchg query, or undefined if ne search query is entered.
     */
    protected queryText: string | undefined;

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
                d.id.toString().includes(text) ||
                d.name.toString().toLowerCase().includes(text) ||
                d.phone.toString().toLowerCase().includes(text));
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(): void
    {
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
     * Called when a driver in the list of drivers is clicked.
     * Assigns the driver to the route and closes the modal.
     */
    protected async onDriverClick(driver: Driver): Promise<void>
    {
        try
        {
            this._result = driver;
            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not assign driver", error);
            this._modal.busy = false;
        }
    }
}
