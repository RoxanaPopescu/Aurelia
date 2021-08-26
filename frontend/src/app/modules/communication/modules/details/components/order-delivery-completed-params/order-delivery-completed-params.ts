import { autoinject, bindable } from "aurelia-framework";
import { MapObject } from "shared/types";
import deliveryMethods from "./resources/strings/delivery-methods.json";

@autoinject
export class OrderDeliveryCompletedParamsCustomElement
{
    /**
     * The available delivery methods.
     */
    protected readonly deliveryMethods = deliveryMethods;

    /**
     * The representing the parameters to present.
     */
    @bindable
    public model: MapObject;

}
