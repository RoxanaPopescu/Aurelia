import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { OrderNew } from "app/model/order";
import { Accent } from '../../../../../../../legacy/packages/shared/src/model/general/accent';

/**
 * Represents the module.
 */
@autoinject
export class OrderOverview
{
    /**
     * The order to present.
     */
    @bindable
    public order: OrderNew | undefined;

    /**
     * Counts the number of picked up colli on the route
     */
    @computedFrom("route.stops.length")
    public get accentFromStatus(): Accent
    {
        if (this.order?.state.status.slug === "cancelled" || this.order?.state.status.slug === "deleted")
        {
            return "negative";
        }

        if (this.order?.state.status.slug === "delivered")
        {
            return "positive";
        }

        return "neutral";
    }
}
