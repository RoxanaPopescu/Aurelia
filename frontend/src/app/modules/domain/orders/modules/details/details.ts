import { autoinject } from "aurelia-framework";
//import { RouteConfig } from "aurelia-router";
//import { ModalService } from "shared/framework/services/modal";
//import { OrderService, Order } from "app/services/domain/orders";

// /**
//  * Represents the URL parameters expected by the module.
//  */
// interface IDetailsModuleParams
// {
//     /**
//      * The slug identifying the order.
//      */
//     orderSlug: string;
// }

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    // public constructor(orderService: OrderService, modalService: ModalService)
    // {
    //     this._orderService = orderService;
    // }

    // private readonly _orderService: OrderService;

    // /**
    //  * The order to present.
    //  */
    // protected order: Order;

    // /**
    //  * Called by the framework when the module is activated.
    //  * @param params The route parameters from the URL.
    //  * @param routeConfig The route configuration.
    //  * @returns A promise that will be resolved when the module is activated.
    //  */
    // public async activate(params: IDetailsModuleParams, routeConfig: RouteConfig): Promise<void>
    // {
    //     // Get the domain models.
    //     this.order = await this._orderService.get(params.orderSlug);

    //     // Set the route title.
    //     routeConfig.navModel!.setTitle(this.order.slug);
    // }
}
