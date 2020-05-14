import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { Route, RouteStop } from "app/model/route";
import { Duration } from "luxon";
import { Collo } from "app/model/collo";

/**
 * Represents the module.
 */
@autoinject
export class RouteOverview
{
    /**
     * The route to present.
     */
    @bindable
    public route: Route | undefined;

    /**
     * Counts the number of picked up colli on the route
     */
    @computedFrom("route.stops.length")
    public get pickedUpColliCount(): number | undefined
    {
        if (this.route == null)
        {
            return undefined;
        }

        let pickedUpColliCount = 0;
        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status.slug === "completed")
                .forEach((s: RouteStop) =>
                {
                    s.pickups.forEach(p => p.colli.forEach(c =>
                        {
                            if (c.status.slug !== "not-picked-up" && c.status.slug !== "no-action")
                            {
                                pickedUpColliCount++;
                            }
                        }));
                });
        }

        return pickedUpColliCount;
    }

    /**
     * Counts the number of delivered colli on the route
     */
    @computedFrom("route.stops.length")
    public get deliveredColliCount(): number | undefined
    {
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
    }

    /**
     * Counts the number of colli on the route
     */
    @computedFrom("route.stops.length")
    public get totalColliCount(): number | undefined
    {
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
    }

    /**
     * Counts the number of colli on the route
     */
    @computedFrom("route.stops.length")
    public get completedColliCount(): number | undefined
    {
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
    }

    /**
     * Counts the number of colli on the completed stops
     */
    @computedFrom("route.stops.length")
    public get completedStops(): number | undefined
    {
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
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length")
    public get routeDuration(): Duration | undefined
    {
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
                // We get the last stop's estimates
                const lastStop = this.route.stops[this.route.stops.length-1];
                if (lastStop instanceof RouteStop && lastStop.estimates != null) {
                    duration = lastStop.estimates.completionTime.diff(from);
                }
            }
        }

        return duration.get("seconds") > 0 ? duration : undefined;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length")
    public get routeDelay(): Duration | undefined
    {
        if (this.route == null || this.route.estimates == null)
        {
            return undefined;
        }

        const lastStop = this.route.stops[this.route.stops.length - 1] as RouteStop;
        const completionTime = this.route.estimates.completionTime;

        if (lastStop.arrivalTimeFrame.to != null &&
            completionTime != null &&
            lastStop.arrivalTimeFrame.to.diff(completionTime).as("second") > 0)
        {
            return lastStop.arrivalTimeFrame.to.diff(completionTime);
        }

        return undefined;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length")
    public get driverOnline(): boolean | undefined
    {
        if (this.route != null)
        {
            return this.route.driverOnline;
        }

        return undefined;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length")
    public get totalLoadingDuration(): Duration
    {
        const totalLoadingDuration = Duration.fromMillis(0);
        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .forEach((s: RouteStop) => {
                    if (s.status.slug === "completed" && s.taskTime != null)
                    {
                        totalLoadingDuration.plus(s.taskTime);
                    }
                });
        }

        return totalLoadingDuration;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.status")
    public get delayedStart(): Duration | undefined
    {
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

        return undefined;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.status")
    public get isRouteDelayed(): boolean
    {
        if (this.route != null)
        {
            if ((this.route.status.slug === 'completed' || this.route.status.slug === 'in-progress') && this.delayedStart)
            {
                return  true;
            }
        }
        return false;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length")
    public get routeStopsOkay(): boolean
    {
        if (this.route != null)
        {
            return this.route.stops.filter(s =>
                s.status.slug === "cancelled" ||
                s.status.slug === "failed").length === 0;
        }

        return false;
    }

    /**
     * Calculates the amount of colli not picked up
     */
    @computedFrom("route.stops.length")
    public get notPickedUpColli(): Collo[]
    {
        let notPickedUpColli: Collo[] = [];
        if (this.route != null)
        {
            let completedPickupStops = this.route.stops.filter(s => s.type.slug === "pickup" &&
                                                                s.status.slug === "completed" &&
                                                                s instanceof RouteStop);
            completedPickupStops.forEach((s: RouteStop) => {
                s.pickups.forEach(p => {
                    p.colli.forEach(c => {
                        if (c.status.slug !== "picked-up")
                        {
                            notPickedUpColli.push(c);
                        }
                    });
                });
            });
        }

        return notPickedUpColli;
    }

    /**
     * Calculates the amount of colli not delivered
     */
    @computedFrom("route.stops.length")
    public get notDeliveredColli(): Collo[]
    {
        let notDeliveredColli: Collo[] = [];
        if (this.route != null)
        {
            let completedPickupStops = this.route.stops.filter(s => s.type.slug === "delivery" &&
                                                                s.status.slug === "completed" &&
                                                                s instanceof RouteStop);
            completedPickupStops.forEach((s: RouteStop) => {
                s.pickups.forEach(p => {
                    p.colli.forEach(c => {
                        if (c.status.slug !== "delivered")
                        {
                            notDeliveredColli.push(c);
                        }
                    });
                });
            });
        }

        return notDeliveredColli;
    }

    /**
     * Calculates the amount failed stops
     */
    @computedFrom("route.stops.length")
    public get failedStops(): RouteStop[]
    {
        if (this.route != null)
        {
            return this.route.stops.filter(s => s instanceof RouteStop)
                                    .filter((s: RouteStop) => s.status.slug === "failed") as RouteStop[];
        }

        return [];
    }

    /**
     * Calculates the amount failed stops
     */
    @computedFrom("route.stops.length")
    public get failedCancelledStops(): RouteStop[]
    {
        if (this.route != null)
        {
            return this.route.stops.filter(s => s instanceof RouteStop)
                                    .filter((s: RouteStop) => s.status.slug === "failed" || s.status.slug === "cancelled") as RouteStop[];
        }

        return [];
    }
}
