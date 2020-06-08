import { autoinject } from "aurelia-framework";
import { OrderNew, OrderStatus, OrderService } from "app/model/order";
import { IValidation, Modal } from "shared/framework";
import { Log } from "shared/infrastructure";
import { observable } from 'aurelia-binding';
import { DateTime } from "luxon";
import { TimeOfDay } from '../../../../../../../shared/types/values/time-of-day';

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
    private _result: OrderNew | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    public model: { order: OrderNew; };

    /**
     * The local date element for latest delivery arrival date
     */
    @observable
    public latestDeliveryArrivalTime: TimeOfDay | undefined;

    /**
     * The local date element for earliest delivery arrival date
     */
    @observable
    public earliestDeliveryArrivalTime: TimeOfDay | undefined;

    /**
     * The local date element for earliest delivery arrival date
     */
    @observable
    public earliestDeliveryArrivalDate: DateTime | undefined;

    /**
     * The local date element for latest pickup arrival date
     */
    @observable
    public latestPickupArrivalTime: TimeOfDay | undefined;

    /**
     * The local date element for earliest pickup arrival date
     */
    @observable
    public earliestPickupArrivalTime: TimeOfDay | undefined;

    /**
     * The local date element for earliest pickup arrival date
     */
    @observable
    public earliestPickupArrivalDate: DateTime | undefined;

    /**
     * The available route status values.
     */
    protected statusValues = Object.keys(OrderStatus.values).map(slug => new OrderStatus(slug as any));

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrderNew | undefined>
    {
        return this._result;
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { order: OrderNew }): void
    {
        this.model = model;
        this.earliestPickupArrivalDate = model.order.pickup.appointment.earliestArrivalDate;
        this.earliestPickupArrivalTime = model.order.pickup.appointment.earliestArrivalTime;
        this.latestPickupArrivalTime = model.order.pickup.appointment.latestArrivalTime;
        this.earliestDeliveryArrivalDate = model.order.delivery.appointment.earliestArrivalDate;
        this.earliestDeliveryArrivalTime = model.order.delivery.appointment.earliestArrivalTime;
        this.latestDeliveryArrivalTime = model.order.delivery.appointment.latestArrivalTime;
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected earliestPickupArrivalTimeChanged(newValue: TimeOfDay | undefined): void
    {
        if (newValue != null)
        {
            this.model.order.pickup.appointment.earliestArrivalTime = newValue;
            this.pickupDateTimeChanged();
        }
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected latestPickupArrivalTimeChanged(newValue: TimeOfDay | undefined): void
    {
        if (newValue != null)
        {
            this.model.order.pickup.appointment.latestArrivalTime = newValue;
            this.pickupDateTimeChanged();
        }
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected earliestPickupArrivalDateChanged(newValue: DateTime | undefined): void
    {
        if (newValue != null)
        {
            this.model.order.pickup.appointment.earliestArrivalDate = newValue;
            this.pickupDateTimeChanged();
        }
    }

    /**
     * Called when the timeFrom, timeTo or date changes value.
     */
    protected pickupDateTimeChanged(): void
    {
        if (this.model.order.pickup.appointment.latestArrivalTime.valueOf() < this.model.order.pickup.appointment.earliestArrivalTime.valueOf())
        {
            this.model.order.pickup.appointment.latestArrivalDate = this.model.order.pickup.appointment.earliestArrivalDate.plus({ day: 1 });
        }
        else
        {
            this.model.order.pickup.appointment.latestArrivalDate = this.model.order.pickup.appointment.earliestArrivalDate;
        }
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected earliestDeliveryArrivalTimeChanged(newValue: TimeOfDay | undefined): void
    {
        if (newValue != null)
        {
            this.model.order.delivery.appointment.earliestArrivalTime = newValue;
            this.deliveryDateTimeChanged();
        }
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected latestDeliveryArrivalTimeChanged(newValue: TimeOfDay | undefined): void
    {
        if (newValue != null)
        {
            this.model.order.delivery.appointment.latestArrivalTime = newValue;
            this.deliveryDateTimeChanged();
        }
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected earliestDeliveryArrivalDateChanged(newValue: DateTime | undefined): void
    {
        if (newValue != null)
        {
            this.model.order.delivery.appointment.earliestArrivalDate = newValue;
            this.deliveryDateTimeChanged();
        }
    }

    /**
     * Called when the timeFrom, timeTo or date changes value.
     */
    protected deliveryDateTimeChanged(): void
    {
        if (this.model.order.delivery.appointment.latestArrivalTime.valueOf() < this.model.order.delivery.appointment.earliestArrivalTime.valueOf())
        {
            this.model.order.delivery.appointment.latestArrivalDate = this.model.order.delivery.appointment.earliestArrivalDate.plus({ day: 1 });
        }
        else
        {
            this.model.order.delivery.appointment.latestArrivalDate = this.model.order.delivery.appointment.earliestArrivalDate;
        }
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
            await this._orderService.saveOrder(this.model.order);

            // Set the result of the modal.
            this._result = this.model.order;
            this._modal.close();
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
