import { autoinject, bindable } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { ModalService } from "shared/framework";
import { OrderEvent } from "app/model/order/entities/order-event";
import { OrderService, Order } from "app/model/order";
import { OrderEventDetailsPanel } from "./modals/order-event-details/order-event-details";
import settings from "resources/settings";

/**
 * Represents the module.
 */
@autoinject
export class OrderEvents
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

    private readonly _orderService: OrderService;
    private readonly _modalService: ModalService;
    private pollTimeout: any;

    /**
     * The base URL to use when fetching public images based on their ID.
     */
    protected readonly publicImageBaseUrl = settings.app.publicImageBaseUrl;

    /**
     * The order to present.
     */
    @bindable
    protected order: Order;

    /**
     * The most recent fetch operation.
     */
    protected fetchOperation: Operation;

    /**
     * The order events, where consecutive events of the same type at the same location are grouped together.
     */
    protected groupedOrderEvents: OrderEvent[][];

    /**
     * True to show the map, otherwise false.
     */
    protected showMap = true;

    /**
     * Called by the framework when the `order` property changes.
     */
    public orderChanged(newValue: string): void
    {
        if (newValue != null)
        {
            this.fetchEvents();

            if (!this.showMap)
            {
                this.showMap = this.order.pickup.location.position != null || this.order.delivery.location.position != null;
            }
        }
    }

    /**
     * Called by the framework when the module is detached.
     */
    public detached(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        clearTimeout(this.pollTimeout);
    }

    /**
     * Called when an event is clicked.
     * Opens a modal showing the details of the event.
     */
    protected async onEventDetailsClick(event: OrderEvent): Promise<void>
    {
        await this._modalService.open(OrderEventDetailsPanel, { event: event }).promise;
    }

    /**
     * Called when a show more/less row is clicked.
     */
    protected onToggleShowMoreClick(orderEventGroup: OrderEvent[] & { __expanded?: boolean}): void
    {
        orderEventGroup.__expanded = !orderEventGroup.__expanded;
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
            try
            {
                const orderEvents = await this._orderService.getEvents(this.order.consignorId, this.order.slug);

                const groupedOrderEvents: OrderEvent[][] = [];

                for (let i = 0; i < orderEvents.length; i++)
                {
                    if (orderEvents[i].eventType.slug !== orderEvents[i - 1]?.eventType.slug)
                    {
                        groupedOrderEvents.push([orderEvents[i]]);
                    }
                    else
                    {
                        groupedOrderEvents[groupedOrderEvents.length - 1].push(orderEvents[i]);
                    }
                }

                this.groupedOrderEvents = groupedOrderEvents;
            }
            finally
            {
                if (!ENVIRONMENT.stubs)
                {
                    this.pollTimeout = setTimeout(() => this.fetchEvents(), 10000);
                }
            }
        });
    }
}
