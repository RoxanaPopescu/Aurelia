import { autoinject } from "aurelia-framework";
import { OrderEvent } from '../../../../../../model/order/entities/order-event';
import { DateTime } from 'luxon';
import { ModalService } from "shared/framework";
import { EventDetailsPanel } from "./modals/event-details/event-details";

/**
 * Represents the module.
 */
@autoinject
export class Events
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        this._modalService = modalService;

        this.events = [
            new OrderEvent({
                id: "a1234567",
                date: DateTime.local(),
                name: "Event1",
                location: "Location1",
                author: { name: "Author1", affiliation: "Company1" }
            }),
            new OrderEvent({
                id: "b1234567",
                date: DateTime.local(),
                name: "Event1",
                location: "Location1",
                author: { name: "Author1", affiliation: "Company1" }
            }),
            new OrderEvent({
                id: "c1234567",
                date: DateTime.local(),
                name: "Event1",
                location: "Location1",
                author: { name: "Author1", affiliation: "Company1" }
            })
        ]
    }

    private readonly _modalService: ModalService;

    /**
     * The data table element.
     */
    protected dataTableElement: HTMLElement;

    /**
     * The data table element.
     */
    protected events: OrderEvent[] = [];

    /**
     * Called when a route stop is clicked.
     * Opens a modal showing the details of the order, and enables editing.
     */
    protected async onEventDetailsClick(event: OrderEvent): Promise<void>
    {
        await this._modalService.open(EventDetailsPanel, { event: event } ).promise;
    }
}
