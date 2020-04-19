import { autoinject, bindable } from "aurelia-framework";
import { MapObject } from "shared/types";

@autoinject
export class OrderCancelledEnRouteParamsCustomElement
{
    /**
     * The representing the parameters to present.
     */
    @bindable
    public model: MapObject;

    public attached(): void
    {
        if (this.model.onlyForOrdersPickedUp == null)
        {
            this.model.onlyForOrdersPickedUp = false;
        }
    }
}
