import { autoinject, bindable } from "aurelia-framework";
import { DateTime, Zone } from "luxon";
import { Log } from "shared/infrastructure";
import { IValidation, Modal } from "shared/framework";
import { VehicleType } from "app/model/vehicle";
import { OrderInfo } from "app/model/order";
import { RouteService } from "app/model/route";

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
    private readonly _modal: Modal;
    private _result: { slug: string; collectionPointIds?: string[] } | undefined;

    /**
     * The model for the modal.
     */
    @bindable
    protected model: { orders: OrderInfo[] };

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
     * If collection points should be created
     */
    protected createCollectionPoints: boolean = false;

    /**
     * The pickup gate for the route being created.
     */
    protected pickupGate: string | undefined;

    /**
     * The time zone of the start date for the route being created.
     */
    protected startTimeZone: Zone | undefined;

    /**
     * The start date for the route being created.
     */
    protected startDateTime: DateTime | undefined;

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

        this.startTimeZone = model.orders[0].pickupLocation.timeZone;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new route's slug, or undefined if cancelled.
     */
    public async deactivate(): Promise<{ slug: string; collectionPointIds?: string[] } | undefined>
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

            if (this.createCollectionPoints)
            {
                const result = await this._routeService.createCollectionPoints(
                    this.model.orders.map(o => o.id),
                    {
                        startDateTime: this.startDateTime!,
                        vehicleType: this.selectedVehicleType!,
                        reference: this.routeReference,
                        pickupGate: this.pickupGate
                    }
                );

                this._result = result;
            }
            else
            {
                const routeSlug = await this._routeService.createRoute(this.model.orders.map(o => o.id), this.routeReference!, this.selectedVehicleType!);
                this._result = { slug: routeSlug };
            }

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not create the route", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
