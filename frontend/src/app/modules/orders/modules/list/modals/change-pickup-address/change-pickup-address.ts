import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation, Modal } from "shared/framework";
import { Address } from "app/model/shared";
import { OrderService, OrderInfo } from "app/model/order";

@autoinject
export class ChangePickupAddressPanel
{
    /**
     * Creates a new instance of the class.
     * @param orderService The `OrderService` instance.
     * @param modal The `Modal` instance.
     */
    public constructor(orderService: OrderService, modal: Modal)
    {
        this._orderService = orderService;
        this._modal = modal;
    }

    private readonly _orderService: OrderService;
    private readonly _modal: Modal;
    private _result = false;

    /**
     * The model for the modal.
     */
    @bindable
    protected model: { orders: OrderInfo[] };

    /**
     * The selected pickup address.
     */
    protected selectedPickupAddress: Address | undefined;

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
     * @returns True if the pickup address was changed, otherwise false.
     */
    public async deactivate(): Promise<boolean | undefined>
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
     * Called when the "Change pickup address" icon is clicked.
     * Changes the pickup address of the orders and closes the modal.
     */
    protected async onChangePickupAddressClick(): Promise<void>
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

            await this._orderService.changePickupAddress(
                this.model.orders.map(o => o.id),
                this.selectedPickupAddress!
            );

            this._result = true;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not change the pickup address", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
