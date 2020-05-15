import { autoinject } from 'aurelia-framework';
import { Modal } from "shared/framework";
import { OrderEvent } from '../../../../../../../../model/order/entities/order-event';

/**
 * Represents the module.
 */
@autoinject
export class EventDetailsPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance.
     */
    public constructor(modal: Modal)
    {
        // this._modal = modal;
    }

    // private readonly _modal: Modal;

    /**
     * The model for the modal.
     */
    public model: { event: OrderEvent };

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<undefined>
    {
        return undefined;
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { event: OrderEvent }): void
    {
        this.model = model;
    }
}
