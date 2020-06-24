import { autoinject, observable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Operation } from "shared/utilities";
import { Modal, IScroll } from "shared/framework";
import { RouteAssignmentService, RouteBase } from "app/model/route";
import { Driver, DriverService } from "app/model/driver";
import { ISorting } from "shared/types";

@autoinject
export class PushDriversPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param driverService The `DriverService` instance.
     */
    public constructor(modal: Modal, routeAssignmentService: RouteAssignmentService, driverService: DriverService)
    {
        this._modal = modal;
        this._routeAssignmentService = routeAssignmentService;
        this._driverService = driverService;
        this._constructed = true;
    }

    private readonly _modal: Modal;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _driverService: DriverService;
    private _result: Driver | undefined;
    private readonly _constructed;

    /**
     * The searchg query, or undefined if ne search query is entered.
     */
    @observable({ changeHandler: "update" })
    protected searchQuery: string | undefined;

    /**
     * The sorting to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected sorting: ISorting =
    {
        property: "name",
        direction: "ascending"
    };

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The route to which a driver should be assigned
     */
    protected route: RouteBase;

    /**
     * The available drivers.
     */
    protected results: Driver[] | undefined;

    /**
     * The selected drivers.
     */
    protected selected: Driver[] = [];

    /**
     * The custom push message for the drivers
     */
    protected message: string | undefined;

    /**
     * Called by the framework when the modal is activated.
     * @param model The route to add the driver too, if undefined it will not be assigned.
     */
    public activate(model: { route: RouteBase }): void
    {
        this.route = model.route;
        this.update();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected driver, or undefined if cancelled.
     */
    public async deactivate(): Promise<Driver | undefined>
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        return this._result;
    }


    /**
     * Called when the driver is selected
     */
    protected async onDriverClick(driver: Driver): Promise<void>
    {
        this.selected = [driver];
        this.onSubmitClick();
    }

    /**
     * Called when a driver in the list of drivers is clicked.
     * Assigns the driver to the route and closes the modal.
     */
    protected async onSubmitClick(): Promise<void>
    {
        try
        {

            this._modal.busy = true;
            await this._routeAssignmentService.pushToDrivers(this.route, this.selected, this.message);
            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not push to drivers", error);
            this._modal.busy = false;
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
            try {
                // Fetch the data. // searchQuery: this.searchQuery,
                const data = await this._driverService.getAll(
                    this.sorting,
                    { page: 1, pageSize: 30 },
                    {
                        statuses: ["approved"],
                        searchQuery: this.searchQuery
                     },
                    signal
                );

                // Update the state.
                this.results = data.results;

                // Scroll to top.
                this.scroll.reset();
            } catch (error) {
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}