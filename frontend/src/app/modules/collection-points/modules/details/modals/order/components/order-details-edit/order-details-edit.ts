import { Order, OrderStatus } from "app/model/collection-point";
import { autoinject, bindable } from "aurelia-framework";
import { IValidation } from "shared/framework";

@autoinject
export class OrderDetailsEditCustomElement
{
    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The available statuses.
     */
    protected statuses = Object.keys(OrderStatus.values).map(slug => new OrderStatus(slug as any));

    /**
     * The model for the modal.
     */
    @bindable
    public model: Order;

    /**
     * Called when the `Save` button is pressed.
     */
    @bindable
    public onSave: () => void;

    /**
     * Called when the `Cancel` button is pressed.
     */
    @bindable
    public onCancel: () => void;
}
