import { autoinject, bindable, observable } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { ModalService } from "shared/framework";
import { OrderEvent } from "app/model/order/entities/order-event";
import { OrderService, Order } from "app/model/order";
import { OrderEventDetailsPanel } from "./modals/order-event-details/order-event-details";
import { LocalStateService } from "app/services/local-state";

/**
 * Represents the module.
 */
@autoinject
export class OrderEvents
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     * @param orderService The `OrderService` instance.
     * @param localStateService The `LocalStateService` instance.
     */
    public constructor(modalService: ModalService, orderService: OrderService, localStateService: LocalStateService)
    {
        this._orderService = orderService;
        this._modalService = modalService;
        this._localStateService = localStateService;
    }

    private readonly _orderService: OrderService;
    private readonly _modalService: ModalService;
    private readonly _localStateService: LocalStateService;
    private pollTimeout: any;

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
    protected orderEventGroups: OrderEvent[][];

    /**
     * True to show the map, otherwise false.
     */
    @observable
    protected showMap: boolean;

    /**
     * Called by the framework when the module is attached.
     */
    public attached(): void
    {
        this.showMap = this._localStateService.get().orderDetails?.showMap ?? true;
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
     * Called by the framework when the `showMap` property changes.
     */
    protected showMapChanged(): void
    {
        this._localStateService.mutate(data =>
        {
            (data.orderDetails ??= {}).showMap = this.showMap;
        });
    }

    /**
     * Called by the framework when the `order` property changes.
     */
    protected orderChanged(newValue: string): void
    {
        if (newValue != null)
        {
            this.fetchEvents();
        }
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

                const orderEventGroups: OrderEvent[][] = [];

                for (let i = 0; i < orderEvents.length; i++)
                {
                    if (orderEvents[i].eventType.slug !== orderEvents[i - 1]?.eventType.slug)
                    {
                        orderEventGroups.push([orderEvents[i]]);
                    }
                    else
                    {
                        orderEventGroups[orderEventGroups.length - 1].push(orderEvents[i]);
                    }
                }

                this.orderEventGroups = orderEventGroups;
            }
            finally
            {
                this.pollTimeout = setTimeout(() => this.fetchEvents(), 10000);
            }
        });
    }
}
