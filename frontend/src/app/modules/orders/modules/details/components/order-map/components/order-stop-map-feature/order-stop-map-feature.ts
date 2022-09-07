import { autoinject, useShadowDOM, bindable, computedFrom } from "aurelia-framework";
import { Callback, GeoJsonPoint } from "shared/types";
import { GoogleMapCustomElement } from "shared/google-maps";
import { OrderStop } from "app/model/order/entities/order-stop";
import { Order } from "app/model/order";

@autoinject
@useShadowDOM
export class OrderStopMapFeatureCustomElement
{
    /**
     * The element representing the component, and the content to be presented.
     */
    protected element: HTMLElement;

    /**
     * The map view model.
     */
     @bindable
    public mapViewModel: GoogleMapCustomElement;

    /**
     * The order to present.
     */
     @bindable
    public order: Order;

    /**
     * The order stop to present.
     */
     @bindable
    public orderStop: OrderStop;

    /**
     * The function to call when the order stop is clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onClick: Callback<boolean | undefined> | undefined;

    /**
     * The function to call when the order stop is double-clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onDblClick: Callback<boolean | undefined> | undefined;

    /**
     * Gets the point representing the order stop, if available.
     */
    @computedFrom("orderStop.location.position")
    protected get point(): GeoJsonPoint
    {
        return this.orderStop.location.position!.toGeoJsonPoint();
    }
}
