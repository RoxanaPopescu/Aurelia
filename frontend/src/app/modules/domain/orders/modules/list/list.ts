import { autoinject } from "aurelia-framework";
//import { RouteConfig } from "aurelia-router";
//import { ModalService } from "shared/framework/services/modal";
//import { OrderService, OrderInfo } from "app/services/domain/orders";

/**
 * Represents the module.
 */
@autoinject
export class ListModule
{
    // public constructor(orderService: OrderService, modalService: ModalService)
    // {
    //     this._orderService = orderService;
    // }

    // private readonly _orderService: OrderService;

    // /**
    //  * The order to present.
    //  */
    // protected orders: OrderInfo[];

    // /**
    //  * Called by the framework when the module is activated.
    //  * @param params The route parameters from the URL.
    //  * @param routeConfig The route configuration.
    //  * @returns A promise that will be resolved when the module is activated.
    //  */
    // public async activate(params: never, routeConfig: RouteConfig): Promise<void>
    // {
    //     // Get the domain models.
    //     this.orders = await this._orderService.getAll();
    // }
}
