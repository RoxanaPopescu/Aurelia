import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { CollectionPoint, Order } from "app/model/collection-point";
import { DateTime } from "luxon";

/**
 * Represents the module.
 */
@autoinject
export class CollectionPointOverview
{
    /**
     * The collection point to present.
     */
    @bindable
    public entry: CollectionPoint | undefined;

    /**
     * Counts the number of orders with deviations
     */
    @computedFrom("entry.orders")
    public get deviatedOrdersCount(): number | undefined
    {
        if (this.entry == null)
        {
            return undefined;
        }

        const result = this.entry.orders.filter((s: Order) => ["missing", "damaged", "not-collected", "rejected"].includes(s.status.slug));

        return result.length;
    }

    /**
     * Counts the number of orders with completed
     */
    @computedFrom("entry.orders")
    public get completedOrdersCount(): number | undefined
    {
        if (this.entry == null)
        {
            return undefined;
        }

        const result = this.entry.orders.filter((s: Order) => ["collected"].includes(s.status.slug));

        return result.length;
    }

    /**
     * Counts the number of orders with completed
     */
    @computedFrom("entry.orders")
    public get delayedOrdersCount(): number | undefined
    {
        if (this.entry == null)
        {
            return undefined;
        }

        const result = this.entry.orders.filter((o: Order) => ["ready-for-collection"].includes(o.status.slug) && o.pickupTimeFrame.to != null && o.pickupTimeFrame.to > DateTime.local());

        return result.length;
    }

    /**
     * Counts the number of orders with completed
     */
    @computedFrom("entry.orders")
    public get ordersNoDeviationsCount(): number | undefined
    {
        if (this.entry == null)
        {
            return undefined;
        }

        const result = this.entry.orders.filter((s: Order) => ["collected", "ready-for-collection"].includes(s.status.slug));

        return result.length;
    }

    /**
     * Counts the number of colli on the route
     */
    @computedFrom("entry.orders")
    public get totalColliCount(): number | undefined
    {
        if (this.entry == null)
        {
            return undefined;
        }

        let totalColliCount = 0;

        this.entry.orders
            .forEach((o: Order) =>
            {
                totalColliCount += o.colli.length;
            });

        return totalColliCount;
    }
}
