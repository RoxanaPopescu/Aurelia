import { autoinject } from "aurelia-framework";
import { OrderEvent } from "app/model/order/entities/order-event";

/**
 * Represents the module.
 */
@autoinject
export class EventDetailsPanel
{
    /**
     * The model for the modal.
     */
    public model: { event: OrderEvent };

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { event: OrderEvent }): void
    {
        this.model = model;
    }
}
