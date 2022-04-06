import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Modal } from "shared/framework";
import { RouteService, RouteStatus, Route } from "app/model/route";
import { ProductType } from "app/model/product";
import { VehicleService, VehicleType } from "app/model/vehicle";

@autoinject
export class RequirementsPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance.
     * @param routeService The `OrderService` instance.
     * @param vehicleService The `VehicleService` instance.
     */

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public constructor(modal: Modal, routeService: RouteService, vehicleService: VehicleService)
    {
        this._modal = modal;
        this._routeService = routeService;
        this._vehicleService = vehicleService;
    }

    private readonly _routeService: RouteService;
    private readonly _vehicleService: VehicleService;
    private readonly _modal: Modal;
    private _result: Route | undefined;

    /**
     * The available statuses.
     */
    protected statusValues = Object.keys(RouteStatus.values).map(slug => new RouteStatus(slug as any));

    /**
     * The available stop types.
     */
    protected types = Object.keys(ProductType.values).map(slug => new ProductType(slug as any));

    /**
     * The model for the modal.
     */
    public model: Route;

    /**
     * The available vehicle types.
     */
    public vehicleTypes: VehicleType[];

    /**
     * Called by the framework when the modal is activated.
     */
    public async activate(model: { route: Route }): Promise<void>
    {
        this.vehicleTypes = await this._vehicleService.getTypes();
        this.model = model.route.clone();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The result of the modal.
     */
    public async deactivate(): Promise<Route | undefined>
    {
        return this._result;
    }

    protected async onSaveClick(): Promise<void>
    {
        try
        {
            // Mark the modal as busy.
            this._modal.busy = true;

            // Save the changes.
            await this._routeService.updateRoute(this.model);

            // Set the result of the modal.
            this._result = this.model;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not update route", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
