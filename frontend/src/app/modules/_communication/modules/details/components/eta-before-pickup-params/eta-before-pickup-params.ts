import { autoinject, bindable } from "aurelia-framework";
import { MapObject } from "shared/types";

@autoinject
export class EtaBeforePickupParamsCustomElement
{
    /**
     * The representing the parameters to present.
     */
    @bindable
    public model: MapObject;
}
