import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Log } from "shared/infrastructure";
import { ModalService, IScroll, ToastService } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrderService, OrderStatus, Order, OrderStatusSlug } from "app/model/order";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";
import { EditOrderPanel } from "./modals/edit-order/edit-order";
import removeOrderFromRouteToast from "./resources/strings/remove-order-from-route-toast.json";

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
     * @param toastService The `ToastService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(router: Router, orderService: OrderService, modalService: ModalService, toastService: ToastService, identityService: IdentityService)
    {
        this._router = router;
        this._orderService = orderService;
        this._modalService = modalService;
        this._toastService = toastService;
        this.identityService = identityService;
    }

    private readonly _router: Router;
    private readonly _orderService: OrderService;
    private readonly _modalService: ModalService;
    private readonly _toastService: ToastService;
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
     * True while loading info about the linked route, otherwise false.
     */
    protected loadingRouteInfo: boolean = true;

    /**
     * The id of the linked route, if any.
     */
    protected routeId: string | undefined;

    /**
     * The slug identifying the linked route, if any.
     */
    protected routeSlug: string | undefined;

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
        this.fetchOrder(true);

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
            Log.error("Could not change order status", error);
        }
    }

    /**
     * Called when an item in the `Remove from route` selector is clicked.
     * Executes the chosen action.
     * @param action The action to execute.
     */
    protected async onRemoveFromRouteItemClick(action: "release-to-drivers" | "manual-dispatch" | "automatic-dispatch"): Promise<void>
    {
        try
        {
            await this._orderService.removeFromRoute(this.routeId!, this.order!.consignorId, this.order!.slug, action);

            this.routeId = undefined;
            this.routeSlug = undefined;

            if (this.tab === "route")
            {
                this.tab = "events";
            }

            this._toastService.open("success",
            {
                heading: removeOrderFromRouteToast.heading,
                body: removeOrderFromRouteToast.body
            });
        }
        catch (error)
        {
            Log.error("Could not remove order from route", error);
        }
    }

    /**
     * Fetches the specified order.
     */
    private async fetchOrder(addToRecent = false): Promise<void>
    {
        try
        {
            this.order = await this._orderService.get(this.orderId);
            this._router.title = this.order.slug;
            this._router.updateTitle();

            if (addToRecent)
            {
                addToRecentEntities(this.order.toEntityInfo());
            }
        }
        catch (error)
        {
            Log.error("An error occurred while loading the list.", error);
        }
    }

    /**
     * Fetches the linked routeId.
     */
    private async fetchRouteId(): Promise<void>
    {
        try
        {
            this.loadingRouteInfo = true;

            const result = await this._orderService.getRouteIdAndSlug(this.orderId);

            this.routeId = result?.id;
            this.routeSlug = result?.slug;

            this.loadingRouteInfo = false;
        }
        catch (error)
        {
            this.loadingRouteInfo = false;

            Log.error("An error occurred while loading the linked route.", error);
        }
    }
}
