import { autoinject, bindable } from "aurelia-framework";
import { MapObject } from "shared/types";

@autoinject
export class OrderDeliveryEtaProvidedParamsCustomElement
{
    /**
     * The representing the parameters to present.
     */
    @bindable
    public model: MapObject;
}
