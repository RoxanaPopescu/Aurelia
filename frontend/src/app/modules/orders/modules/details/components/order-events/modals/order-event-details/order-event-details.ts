import { autoinject } from "aurelia-framework";
import { OrderEvent } from "app/model/order/entities/order-event";
import settings from "resources/settings";

/**
 * Represents the panel.
 */
@autoinject
export class OrderEventDetailsPanel
{
    /**
     * The base URL to use when fetching public images based on their ID.
     */
    protected readonly publicImageBaseUrl = settings.app.publicImageBaseUrl;

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
