import { autoinject, computedFrom } from "aurelia-framework";
import { IValidation, Modal, ModalService } from "shared/framework";
import { Route, RouteService, RouteStop } from "app/model/route";
import { Log } from "shared/infrastructure";
import { SelectOrderPanel } from "../select-order/select-order";
import { OrderInfo } from "app/model/order";
import { DateTime } from "luxon";

@autoinject
export class AddOrdersPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `OrderService` instance.
     * @param modalService The `ModalService` instance.
     * /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */

     public constructor(modal: Modal, routeService: RouteService, modalService: ModalService)
    {
        this._modal = modal;
        this._modalService = modalService;
        this._routeService = routeService;
    }

    private readonly _routeService: RouteService;
    private readonly _modalService: ModalService;
    private readonly _modal: Modal;
    private _result: boolean = false;

    /**
     * The orders to add
     */
    protected orders: OrderInfo[] = [];

    /**
     * If true, new pickup stops are created.
     */
    protected newPickupStops = false;

    /**
     * If true, new delivery stops are created.
     */
    protected newDeliveryStops = false;

    /**
     * The selected pickup stop
     */
    protected selectedPickupStop: RouteStop | undefined;

    /**
     * The selected delivery stop
     */
    protected selectedDeliveryStop: RouteStop | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    public model: Route;

    /**
     * Returns not visited pickup stops
     */
    @computedFrom("route.stops")
    public get pickupStops(): RouteStop[]
    {
        const stops =  this.model.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "not-visited" && s.type.slug === "pickup");

        return stops as RouteStop[];
    }

    /**
     * Returns not visited delivery stops
     */
    @computedFrom("route.stops")
    public get deliveryStops(): RouteStop[]
    {
        const stops =  this.model.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "not-visited" && s.type.slug === "delivery");

        return stops as RouteStop[];
    }

    /**
     * Called by the framework when the modal is activated.
     */
    public activate(model: { route: Route }): void
    {
        this.model = model.route.clone();

        if (this.pickupStops.length === 0)
        {
            this.newPickupStops = true;
        }

        if (this.deliveryStops.length === 0)
        {
            this.newDeliveryStops = true;
        }
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The result of the modal.
     */
    public async deactivate(): Promise<boolean>
    {
        return this._result;
    }

    /**
     * Called when we show the order list
     */
    protected async onAddOrderClick(): Promise<void>
    {
        const from = (this.model.plannedTimeFrame?.from ?? DateTime.local()).minus({ day: 1 }).startOf("day");
        const to = (this.model.plannedTimeFrame?.to ?? DateTime.local()).plus({ day: 2 }).endOf("day");

        const order = await this._modalService.open(
            SelectOrderPanel,
            {
                removeOrderIds: this.orders.map(o => o.id),
                filter: {
                    fromDate: from,
                    toDate: to
                }
            }
        ).promise;

        if (order != null)
        {
            this.orders.push(order);
        }
    }

    /**
     * Called when the "Remove order" button is clicked.
     * @param order The order to remove from the list.
     */
    protected onRemoveOrderClick(order: OrderInfo): void
    {
        this.orders.splice(this.orders.findIndex(o => o.id === order.id), 1);
    }

    /**
     * Called when the user wants to add the order to the route
     */
    protected async onSaveClick(): Promise<void>
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

            // Save the changes.
            await this._routeService.addOrders(
                this.model,
                this.orders,
                { newPickupStops: this.newPickupStops, newDeliveryStops: this.newDeliveryStops, pickupStop: this.selectedPickupStop, deliveryStop: this.selectedDeliveryStop }
            );

            // Set the result of the modal.
            this._result = true;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not add the order", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
