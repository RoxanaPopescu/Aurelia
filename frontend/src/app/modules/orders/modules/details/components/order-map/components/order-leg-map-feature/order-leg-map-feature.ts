import { autoinject, containerless, bindable, computedFrom } from "aurelia-framework";
import { Callback, GeoJsonPoint } from "shared/types";
import { GoogleMapCustomElement } from "shared/google-maps";
import { Order } from "app/model/order";

/**
 * Represents a map feature that presents a leg of the order journey
 * as a line from the pickup position to the delivery position.
 */
@autoinject
@containerless
export class OrderLegMapFeatureCustomElement
{
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
     * The function to call when the order leg is clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onClick: Callback<boolean | undefined> | undefined;

    /**
     * The function to call when the order leg is double-clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onDblClick: Callback<boolean | undefined> | undefined;

    /**
     * Gets the points representing the beginning and end of the order leg, if available.
     */
    @computedFrom("order.pickup.location.position", "order.delivery.location.position")
    protected get points(): GeoJsonPoint[]
    {
        return [this.order.pickup.location.position!.toGeoJsonPoint(), this.order.delivery.location.position!.toGeoJsonPoint()];
    }
}
