import { autoinject } from 'aurelia-framework';
import { Router } from "aurelia-router";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { ModalService, IScroll } from "shared/framework";
import { RouteStatusSlug } from "app/model/route";
import { IdentityService } from "app/services/identity";
import { OrderService, OrderStatus, OrderNew } from "app/model/order";
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
     * @param orderService The `OrderService` instance.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     * @param router The `Router` instance.
     */
    public constructor(orderService: OrderService, modalService: ModalService, identityService: IdentityService, router: Router)
    {
        this._orderService = orderService;
        this._modalService = modalService;
        this._router = router;
        this.identityService = identityService;
    }

    private pollTimeout: any;

    private readonly _orderService: OrderService;
    private readonly _modalService: ModalService;
    private readonly _router: Router;
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
    protected tab: "events" | "shippings" = "events";

    /**
     * If the current user is allowed to edit the order.
     */
    protected editable = false;

    /**
     * True to show the map, otherwise false.
     */
    protected orderId: string;

    /**
     * True to show the map, otherwise false.
     */
    protected showMap = true;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The order to present.
     */
    protected order: OrderNew | undefined;

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
        this.fetchOrder();
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
     * Called when a route stop is clicked.
     * Opens a modal showing the details of the order, and enables editing.
     */
    protected async onEditOrderClick(): Promise<void>
    {
        const savedOrder = await this._modalService.open(EditOrderPanel, { order: this.order! }).promise;

        if (savedOrder != null)
        {
            this.fetchOrder();
        }
    }

    /**
     * Called when an item in the `Status` selector is clicked.
     * Sets the new route status.
     * @param status The slug identifying the new route status.
     */
    protected async onStatusItemClick(status: RouteStatusSlug): Promise<void>
    {
        if (status === this.order!.state.status.slug)
        {
            return;
        }

        try
        {
            // await this._orderService.(this.order!, status);
        }
        catch (error)
        {
            Log.error("Could not change route status", error);
        }
    }

    /**
     * Fetches the specified order.
     * @param orderId The ID of the order to fetch.
     */
    private fetchOrder(): void
    {
        clearTimeout(this.pollTimeout);

        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        this.fetchOperation = new Operation(async signal =>
        {
            this.order = await this._orderService.getV2(this.orderId);

            this._router.title = this.order.slug;
            this._router.updateTitle();

            this.pollTimeout = setTimeout(() => this.fetchOrder(), 6000);
        });
    }
}
