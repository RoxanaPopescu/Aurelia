import { autoinject } from "aurelia-framework";
import { observable } from "aurelia-binding";
import { DateTime, Duration } from "luxon";
import { Log } from "shared/infrastructure";
import { IValidation, Modal } from "shared/framework";
import { Order, OrderStatus, OrderService } from "app/model/order";

/**
 * Represents the module.
 */
@autoinject
export class EditOrderPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance.
     * @param orderService The `OrderService` instance.
     */
    public constructor(modal: Modal, orderService: OrderService)
    {
        this._modal = modal;
        this._orderService = orderService;
    }

    private readonly _orderService: OrderService;
    private readonly _modal: Modal;
    private _result: Order | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The available route status values.
     */
    protected statusValues = Object.keys(OrderStatus.values).map(slug => new OrderStatus(slug as any));

    /**
     * The model for the modal.
     */
    public model: Order;

    @observable
    public pickupDate: DateTime | undefined;

    @observable
    public earliestPickupArrivalTime: Duration | undefined;

    @observable
    public latestPickupArrivalTime: Duration | undefined;

    @observable
    public deliveryDate: DateTime | undefined;

    @observable
    public earliestDeliveryArrivalTime: Duration | undefined;

    @observable
    public latestDeliveryArrivalTime: Duration | undefined;

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<Order | undefined>
    {
        return this._result;
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { order: Order }): void
    {
        this.model = model.order.clone();
        this.pickupDate = this.model.pickup.appointment.earliestArrivalDate.startOf("day");
        this.earliestPickupArrivalTime = this.model.pickup.appointment.earliestArrivalDate.diff(this.model.pickup.appointment.earliestArrivalDate.startOf("day"));
        this.latestPickupArrivalTime = this.model.pickup.appointment.latestArrivalDate.diff(this.model.pickup.appointment.latestArrivalDate.startOf("day"));
        this.deliveryDate = this.model.delivery.appointment.earliestArrivalDate.startOf("day");
        this.earliestDeliveryArrivalTime = this.model.delivery.appointment.earliestArrivalDate.diff(this.model.delivery.appointment.earliestArrivalDate.startOf("day"));
        this.latestDeliveryArrivalTime = this.model.delivery.appointment.latestArrivalDate.diff(this.model.delivery.appointment.latestArrivalDate.startOf("day"));
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected earliestPickupArrivalTimeChanged(newValue: Duration | undefined): void
    {
        this.pickupDateTimeChanged();
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected latestPickupArrivalTimeChanged(newValue: Duration | undefined): void
    {
        this.pickupDateTimeChanged();
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected pickupDateChanged(newValue: DateTime | undefined): void
    {
        this.pickupDateTimeChanged();
    }

    /**
     * Called when the timeFrom, timeTo or date changes value.
     */
    protected pickupDateTimeChanged(): void
    {
        if (this.earliestPickupArrivalTime == null || this.latestPickupArrivalTime == null || this.pickupDate == null)
        {
            return;
        }

        const date = this.pickupDate.startOf("day");

        this.model.pickup.appointment.earliestArrivalDate = date.plus(this.earliestPickupArrivalTime);

        let latestDate = date.plus(this.latestPickupArrivalTime);

        if (this.latestPickupArrivalTime < this.earliestPickupArrivalTime)
        {
            latestDate = latestDate.plus({ day: 1 });
        }

        this.model.pickup.appointment.latestArrivalDate = latestDate;
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected earliestDeliveryArrivalTimeChanged(newValue: Duration | undefined): void
    {
        this.deliveryDateTimeChanged();
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected latestDeliveryArrivalTimeChanged(newValue: Duration | undefined): void
    {
        this.deliveryDateTimeChanged();
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected deliveryDateChanged(newValue: DateTime | undefined): void
    {
        this.deliveryDateTimeChanged();
    }

    /**
     * Called when the timeFrom, timeTo or date changes value.
     */
    protected deliveryDateTimeChanged(): void
    {
        if (this.earliestDeliveryArrivalTime == null || this.latestDeliveryArrivalTime == null || this.deliveryDate == null)
        {
            return;
        }

        const date = this.deliveryDate.startOf("day");

        this.model.delivery.appointment.earliestArrivalDate = date.plus(this.earliestDeliveryArrivalTime);

        let latestDate = date.plus(this.latestDeliveryArrivalTime);

        if (this.latestDeliveryArrivalTime < this.earliestDeliveryArrivalTime)
        {
            latestDate = latestDate.plus({ day: 1 });
        }

        this.model.delivery.appointment.latestArrivalDate = latestDate;
    }

    /**
     * Called when the "Save" icon is clicked.
     * Saves changes and closes the modal.
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
            await this._orderService.saveOrder(this.model);

            // Set the result of the modal.
            this._result = this.model;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the order", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
