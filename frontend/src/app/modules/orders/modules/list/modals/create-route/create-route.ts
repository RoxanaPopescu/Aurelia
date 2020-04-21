import { autoinject, bindable } from 'aurelia-framework';
import { IValidation } from "shared/framework";
import { Log } from "shared/infrastructure";
import { Modal } from "../../../../../../../shared/framework/services/modal/modal";
import { OrderInfo } from "app/model/order";
import { RouteService } from "app/model/route";
import { VehicleType } from "shared/src/model/session";

@autoinject
export class CreateRoutePanel
{
    /**
     * Creates a new instance of the class.
    * @param routeService The `RouteService` instance.
    * @param modal The `Modal` instance.
     */
    public constructor(routeService: RouteService, modal: Modal)
    {
        this._routeService = routeService;
        this._modal = modal;
    }

    private readonly _routeService: RouteService;
    private _modal: Modal;
    private _result: string | undefined;

    /**
     * The model for the modal.
     */
    @bindable
    protected model: { orders: OrderInfo[]; };

    /**
     * The available vehicle types.
     */
    protected vehicleTypes = VehicleType.getAll();

    /**
     * The selected vehicle type for the route being created.
     */
    protected selectedVehicleType: VehicleType | undefined;

    /**
     * The reference for the route being created.
     */
    protected routeReference: string | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The orders for the route to be created from.
     */
    public activate(model: { orders: OrderInfo[] }): void
    {
        this.model = { orders: model.orders.slice() };
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new route's slug, or undefined if cancelled.
     */
    public async deactivate(): Promise<string | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Remove order" button is clicked.
     * @param order The order to remove from the list.
     */
    public onRemoveOrderClick(order: OrderInfo): void
    {
        this.model.orders.splice(this.model.orders.findIndex(o => o.id === order.id), 1);
    }

    /**
     * Called when the "Cancel" button is clicked.
     * Discards changes and closes the modal.
     */
    protected async onCancel(): Promise<void>
    {
        await this._modal.close();
    }

    /**
     * Called when the "Create" icon is clicked.
     * Creates a route and closes the modal.
     */
    protected async onCreateClick(): Promise<void>
    {
        try
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            // Mark the modal as busy.
            this._modal.busy = true;

            // Create the route
            let routeSlug = await this._routeService.createRoute(this.model.orders.map(o => o.id), this.routeReference!, this.selectedVehicleType!);

            // Set the result of the modal.
            this._result = routeSlug;
            this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the route stop", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
