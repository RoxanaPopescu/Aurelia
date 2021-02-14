import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Log } from "shared/infrastructure";
import { ModalService, IScroll } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrderService, OrderStatus, Order, OrderStatusSlug } from "app/model/order";
import { EditOrderPanel } from "./modals/edit-order/edit-order";

/**
 * Represents the order parameters for the page.
 */
interface IOrderParams
{
    /**
     * The ID of the order.
     */
    id: string;
}

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    /**
     * Creates a new instance of the class.
     * @param router The `Router` instance.
     * @param orderService The `OrderService` instance.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(router: Router, orderService: OrderService, modalService: ModalService, identityService: IdentityService)
    {
        this._router = router;
        this._orderService = orderService;
        this._modalService = modalService;
        this.identityService = identityService;
    }

    private readonly _router: Router;
    private readonly _orderService: OrderService;
    private readonly _modalService: ModalService;
    protected readonly identityService: IdentityService;
    protected readonly environment = ENVIRONMENT.name;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The data table element.
     */
    protected dataTableElement: HTMLElement;

    /**
     * Current tab page the user is routed to.
     */
    protected tab: "events" | "colli" | "route" = "events";

    /**
     * If the current user is allowed to edit the order.
     */
    protected editable = false;

    /**
     * True to show the map, otherwise false.
     */
    protected orderId: string;

    /**
     * The id of the linked route.
     */
    protected loadingRouteId: boolean = true;

    /**
     * The id of the linked route.
     */
    protected routeId: string | undefined;

    /**
     * The order to present.
     */
    protected order: Order | undefined;

    /**
     * The available route status values.
     */
    protected statusValues = Object.keys(OrderStatus.values).map(slug => new OrderStatus(slug as any));

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IOrderParams): void
    {
        this.orderId = params.id;

        // tslint:disable-next-line: no-floating-promises
        this.fetchOrder();

        // tslint:disable-next-line: no-floating-promises
        this.fetchRouteId();
    }

    /**
     * Called when a route stop is clicked.
     * Opens a modal showing the details of the order, and enables editing.
     */
    protected async onEditOrderClick(): Promise<void>
    {
        const savedOrder = await this._modalService.open(EditOrderPanel, { order: this.order! }).promise;

        if (savedOrder != null)
        {
            this.order = savedOrder;
        }
    }

    /**
     * Called when an item in the `Status` selector is clicked.
     * Sets the new route status.
     * @param status The slug identifying the new route status.
     */
    protected async onStatusItemClick(status: OrderStatusSlug): Promise<void>
    {
        if (status === this.order!.state.status.slug)
        {
            return;
        }

        try
        {
            await this._orderService.updateStatus(this.order!, status);
            this.order!.state.status = new OrderStatus(status);
        }
        catch (error)
        {
            Log.error("Could not change route status", error);
        }
    }

    /**
     * Fetches the specified order.
     */
    private async fetchOrder(): Promise<void>
    {
        try
        {
            this.order = await this._orderService.get(this.orderId);
            this._router.title = this.order.slug;
            this._router.updateTitle();
        }
        catch (error)
        {
            Log.error("An error occurred while loading the list.\n", error);
        }
    }

    /**
     * Fetches the linked routeId.
     */
    private async fetchRouteId(): Promise<void>
    {
        try
        {
            this.routeId = await this._orderService.getRouteId(this.orderId);
            this.loadingRouteId = false;
        }
        catch (error)
        {
            this.loadingRouteId = false;
            Log.error("An error occurred while loading the linked route.\n", error);
        }
    }
}
