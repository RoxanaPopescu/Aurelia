import { autoinject } from "aurelia-framework";
import { OrderNew, OrderStatus, OrderService } from "app/model/order";
import { IValidation, Modal } from "shared/framework";
import { Log } from "shared/infrastructure";

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
