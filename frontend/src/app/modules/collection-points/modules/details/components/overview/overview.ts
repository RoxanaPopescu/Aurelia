import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { Duration } from "luxon";
import { CollectionPoint, Order } from "app/model/collection-point";

/**
 * Represents the module.
 */
@autoinject
export class Overview
{
    /**
     * The route to present.
     */
    @bindable
    public collectionPoint: CollectionPoint | undefined;

    /**
     * Counts the number of orders with deviations
     */
    @computedFrom("collectionPoint.orders.length")
    public get deviatedOrdersCount(): number | undefined
    {
        if (this.collectionPoint == null)
        {
            return undefined;
        }

        const result = this.collectionPoint.orders.filter((s: Order) => ["missing", "damaged", "not-collected", "rejected"].includes(s.status.slug));

        return result.length;
    }

    /**
     * Counts the number of orders with completed
     */
    @computedFrom("collectionPoint.orders.length")
    public get completedOrdersCount(): number | undefined
    {
        if (this.collectionPoint == null)
        {
            return undefined;
        }

        const result = this.collectionPoint.orders.filter((s: Order) => ["collected"].includes(s.status.slug));

        return result.length;
    }

    /**
     * Counts the number of picked up colli on the route
     */
    @computedFrom("route.stops.length")
    public get pickedUpColliCount(): number | undefined
    {
        if (this.collectionPoint == null)
        {
            return undefined;
        }

        /*
        let pickedUpColliCount = 0;

        this.route.stops
            .filter(s => s instanceof RouteStop)
            .filter((s: RouteStop) => s.status.slug === "completed")
            .forEach((s: RouteStop) =>
            {
                s.pickups.forEach(p => p.colli.forEach(c =>
                {
                    if (c.status.slug !== "no-action" && c.status.slug !== "not-picked-up")
                    {
                        pickedUpColliCount++;
                    }
                }));
            });

        return pickedUpColliCount;
        */

        return 0;
    }

    /**
     * Counts the number of delivered colli on the route
     */
    @computedFrom("route.stops.length")
    public get deliveredColliCount(): number | undefined
    {
        /*
        if (this.route == null)
        {
            return undefined;
        }

        let deliveredColliCount = 0;

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "completed")
                .forEach((s: RouteStop) =>
                {
                    s.deliveries.forEach(p => p.colli.forEach(c =>
                    {
                        if (c.status.slug === "delivered")
                        {
                            deliveredColliCount++;
                        }
                    }));
                });
        }

        return deliveredColliCount;
        */

        return 0;
    }

    /**
     * Counts the number of colli on the route
     */
    @computedFrom("route.stops.length")
    public get totalColliCount(): number | undefined
    {
        /*
        if (this.route == null)
        {
            return undefined;
        }

        let totalColliCount = 0;

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .forEach((s: RouteStop) =>
                {
                    s.pickups.forEach(p => totalColliCount += p.colli.length);
                });
        }

        return totalColliCount;
        */

        return 0;
    }

    /**
     * Counts the number of colli on completed stops
     */
    @computedFrom("route.stops.length")
    public get completedColliCount(): number | undefined
    {

        /*
        if (this.route == null)
        {
            return undefined;
        }

        let totalColliCount = 0;

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "completed")
                .forEach((s: RouteStop) =>
                {
                    s.pickups.forEach(p => totalColliCount += p.colli.length);
                });
        }

        return totalColliCount;

        */

        return 0;
    }

    /**
     * Counts the number of stops not cancelled
     */
    @computedFrom("route.stops.length")
    public get notCancelledStops(): number | undefined
    {
        /*
        if (this.route == null)
        {
            return undefined;
        }

        let stopsCount = 0;

        if (this.route != null)
        {
            stopsCount = this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug !== "cancelled").length;
        }

        return stopsCount;

        */

        return 0;
    }

    /**
     * Counts the number of completed stops
     */
    @computedFrom("route.stops.length")
    public get completedStops(): number | undefined
    {
        /*
        if (this.route == null)
        {
            return undefined;
        }

        let completedStops = 0;

        if (this.route != null)
        {
            completedStops = this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "completed").length;
        }

        return completedStops;
        */

        return 0;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length", "route.completedTime")
    public get routeDuration(): Duration | undefined
    {

        /*
        if (this.route == null)
        {
            return undefined;
        }

        let duration = Duration.fromMillis(0);

        if ((this.route.stops[0] as RouteStop).arrivedTime != null)
        {
            const from = (this.route.stops[0] as RouteStop).arrivedTime!;

            if (this.route.completedTime != null)
            {
                duration = this.route.completedTime.diff(from);
            }
            else
            {
                const lastStop = this.route.stops[this.route.stops.length - 1];

                if (lastStop instanceof RouteStop && lastStop.estimates != null)
                {
                    duration = lastStop.estimates.completionTime.diff(from);
                }
            }
        }

        return duration.get("seconds") > 0 ? duration : undefined;

        */

        return undefined;
    }

    @computedFrom("route.stops.length", "route.estimates.completionTime")
    public get routeDelay(): Duration | undefined
    {
        /*
        if (this.route == null || this.route.estimates == null)
        {
            return undefined;
        }

        const notCancelledStops = this.route.stops.filter(s => s.status.slug !== "cancelled");
        const lastStop = notCancelledStops[notCancelledStops.length - 1] as RouteStop;
        const completionTime = this.route.estimates.completionTime;

        if (lastStop.arrivalTimeFrame.to != null &&
            completionTime != null &&
            lastStop.arrivalTimeFrame.to.diff(completionTime).as("second") > 0)
        {
            return lastStop.arrivalTimeFrame.to.diff(completionTime);
        }
        */

        return undefined;
    }

    @computedFrom("route.stops.driverOnline")
    public get driverOnline(): boolean | undefined
    {
        /*
        if (this.route != null)
        {
            return this.route.driverOnline;
        }
        */

        return undefined;
    }

    @computedFrom("route.stops.length")
    public get totalLoadingDuration(): Duration
    {

        /*
        const totalLoadingDuration = Duration.fromMillis(0);

        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .forEach((s: RouteStop) =>
                {
                    if (s.status.slug === "completed" && s.taskTime != null)
                    {
                        totalLoadingDuration.plus(s.taskTime);
                    }
                });
        }

        return totalLoadingDuration;

        */

        return Duration.fromMillis(0);
    }

    /**
     * The time the driver arrived too early at the first stop.
     */
    @computedFrom("route.status")
    public get earlyStart(): Duration | undefined
    {
        /*
        if (this.route != null && this.route.stops[0] instanceof RouteStop)
        {
            if (this.route.stops[0].arrivedTime != null)
            {
                if (this.route.stops[0].arrivalTimeFrame.from != null &&
                    this.route.stops[0].arrivalTimeFrame.from.diff(this.route.stops[0].arrivedTime).as("second") > 0)
                {
                    return this.route.stops[0].arrivalTimeFrame.from.diff(this.route.stops[0].arrivedTime);
                }
                if (this.route.stops[0].arrivalTimeFrame.to != null &&
                    this.route.stops[0].arrivalTimeFrame.to.diff(this.route.stops[0].arrivedTime).as("second") > 0)
                {
                    return this.route.stops[0].arrivalTimeFrame.to.diff(this.route.stops[0].arrivedTime);
                }
            }
        }
        */

        return undefined;
    }

    @computedFrom("route.stops.length")
    public get routeStopsOkay(): boolean
    {
        /*
        if (this.route != null)
        {
            return this.route.stops.filter(s =>
                s.status.slug === "cancelled" ||
                s.status.slug === "failed").length === 0;
        }

        */
        return false;
    }
}
