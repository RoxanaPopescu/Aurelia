import { autoinject, bindable } from 'aurelia-framework';
import { OrderEvent } from '../../../../../../model/order/entities/order-event';
import { ModalService } from "shared/framework";
import { EventDetailsPanel } from "./modals/event-details/event-details";
import { Operation } from "shared/utilities";
import { OrderService } from "app/model/order";

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
    public constructor(modalService: ModalService, orderService: OrderService)
    {
        this._orderService = orderService;
        this._modalService = modalService;
    }

    private pollTimeout: any;

    private readonly _orderService: OrderService;
    private readonly _modalService: ModalService;

    /**
     * The data table element.
     */
    protected dataTableElement: HTMLElement;

    /**
     * True to show the map, otherwise false.
     */
    @bindable
    protected orderId: string;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The current events.
     */
    protected completedEvents: OrderEvent[] = [];

    /**
     * The upcoming events.
     */
    protected futureEvents: OrderEvent[] = [];

    /**
     * Called when a route stop is clicked.
     * Opens a modal showing the details of the order, and enables editing.
     */
    protected async onEventDetailsClick(event: OrderEvent): Promise<void>
    {
        await this._modalService.open(EventDetailsPanel, { event: event } ).promise;
    }

    /**
     * Counts the number of picked up colli on the route
     */
    public isLatestEvent(events: OrderEvent[], event: OrderEvent): boolean
    {
        if (events[events.length - 1].id === event.id)
        {
            return true;
        }

        return false;
    }

    /**
     * Called by the framework when the module is activated.
     */
    public orderIdChanged(newValue: string): void
    {
        if (newValue != null)
        {
            this.fetchEvents();
        }
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        clearTimeout(this.pollTimeout);
    }

    /**
     * Fetches the specified order.
     */
    private fetchEvents(): void
    {
        clearTimeout(this.pollTimeout);

        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        this.fetchOperation = new Operation(async signal =>
        {
            let response = await this._orderService.getEvents(this.orderId);

            this.futureEvents = response.futureEvents;
            this.completedEvents = response.completedEvents;

            this.pollTimeout = setTimeout(() => this.fetchEvents(), 10000);
        });
    }
}
