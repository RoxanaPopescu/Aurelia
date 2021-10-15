import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { RouteTemplate } from "app/model/route-template";
import { Consignor } from "app/model/outfit";
import { VehicleType } from "app/model/vehicle";

/**
 * Represents the page.
 */
@autoinject
export class General
{
    /**
     * The template to present.
     */
    @bindable
    protected template: RouteTemplate;

    // TODO: Make it work with connections
    /**
     * The available consignors.
     */
    protected consignors: Consignor[];

    /**
     * The current consignor.
     */
    @computedFrom("consignors", "template.routeOwnerId")
    protected get currentRouteOwner(): undefined | Consignor
    {
        if (this.template == null || this.template.routeOwnerId == null || this.consignors == null)
        {
            return undefined;
        }

        return this.consignors.find(c => c.id === this.template.routeOwnerId);
    }

    protected set currentRouteOwner(consignor: undefined | Consignor)
    {
        if (this.template != null && consignor != null)
        {
            this.template.routeOwnerId = consignor?.id;
        }
    }

    /**
     * The available vehicle types.
     */
    protected vehicleTypes = VehicleType.getAll();
}
