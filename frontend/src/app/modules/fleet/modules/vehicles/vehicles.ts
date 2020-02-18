import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { IScroll } from "shared/framework";
import { Vehicle, VehicleService } from "app/model/vehicle";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param vehicleService The `VehicleService` instance.
     */
    public constructor(vehicleService: VehicleService)
    {
        this._vehicleService = vehicleService;
        this._constructed = true;
    }

    private readonly _vehicleService: VehicleService;
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
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(): Promise<void>
    {
        this.update();
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
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
    protected update(newValue?: any, oldValue?: any, propertyName?: string): void
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
            const result = await this._vehicleService.getAll(signal);

            // Update the state.
            this.vehicles = result;

            // Scroll to top.
            this.scroll.reset();
        });
    }
}
