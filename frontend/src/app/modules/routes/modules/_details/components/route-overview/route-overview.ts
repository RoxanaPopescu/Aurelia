import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { Route, RouteStop } from "app/model/route";
import { ColloStatus } from "app/model/collo";
import { RouteStopStatus } from "../../../../../../../legacy/packages/shared/src/model/logistics/routes/routeStopStatus";
import { RouteStatus } from "../../../../../../../legacy/packages/shared/src/model/logistics/routes/routeStatus";
import { DateTime, Duration } from "luxon";

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
    protected route: Route | undefined;

    /**
     * Counts the number of picked up colli on the route
     */
    @computedFrom("route.stops.length")
    public get pickedUpColliCount(): number
    {
        let pickedUpColliCount = 0;
        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status === new RouteStopStatus("completed"))
                .forEach((s: RouteStop) =>
                {
                    s.pickups.forEach(p => p.colli.forEach(c =>
                        {
                            if (c.status === new ColloStatus("picked-up"))
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
    public get deliveredColliCount(): number
    {
        let deliveredColliCount = 0;
        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status === new RouteStopStatus("completed"))
                .forEach((s: RouteStop) =>
                {
                    s.deliveries.forEach(p => p.colli.forEach(c =>
                        {
                            if (c.status === new ColloStatus("delivered"))
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
    public get totalColliCount(): number
    {
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
    public get completedColliCount(): number
    {
        let totalColliCount = 0;
        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status === new RouteStopStatus("completed"))
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
    public get completedStops(): number
    {
        let completedStops = 0;

        if (this.route != null)
        {
            completedStops = this.route.stops
                .filter(s => s instanceof RouteStop)
                .filter((s: RouteStop) => s.status === new RouteStopStatus("completed")).length;
        }

        return completedStops;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length")
    public get routeDuration(): Duration
    {
        let duration = Duration.fromMillis(0);

        if (this.route != null && (this.route.stops[0] as RouteStop).arrivalTime != null)
        {
            const from = (this.route.stops[0] as RouteStop).arrivalTime;

            if (this.route.status === new RouteStatus("completed"))
            {
                duration = DateTime.local().diff(this.route.completionTime!);
            }
            else
            {
                duration = DateTime.local().diff(from!);
            }
        }

        return duration;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.stops.length")
    public get routeDelay(): Duration | undefined
    {
        if (this.route != null)
        {
            const lastStop = this.route.stops[this.route.stops.length - 1] as RouteStop;
            if (lastStop.arrivalTimeFrame.to != null &&
                this.route.completionTime != null &&
                lastStop.arrivalTimeFrame.to.diff(this.route.completionTime).as("second") > 0)
            {
                return lastStop.arrivalTimeFrame.to.diff(this.route.completionTime);
            }
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
                    if (s.status === new RouteStopStatus("completed"))
                    {
                        totalLoadingDuration.plus(s.loadingTime);
                    }
                });
        }

        return totalLoadingDuration;
    }

    /**
     * Calculates the duration of the route
     */
    @computedFrom("route.status")
    public get delayedStart(): Duration
    {
        if (this.route != null && this.route.stops[0] instanceof RouteStop)
        {
            if (this.route.stops[0].arrivalTime != null)
            {
                if (this.route.stops[0].arrivalTimeFrame.from != null &&
                    this.route.stops[0].arrivalTime.diff(this.route.stops[0].arrivalTimeFrame.from).as("second") < 0)
                {
                    return this.route.stops[0].arrivalTime.diff(this.route.stops[0].arrivalTimeFrame.from);
                }
                if (this.route.stops[0].arrivalTimeFrame.to != null &&
                    this.route.stops[0].arrivalTime.diff(this.route.stops[0].arrivalTimeFrame.to).as("second") > 0)
                {
                    return this.route.stops[0].arrivalTime.diff(this.route.stops[0].arrivalTimeFrame.to);
                }
            }
        }

        return Duration.fromMillis(0);
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
                s.status === new RouteStopStatus("cancelled") ||
                s.status === new RouteStopStatus("failed")).length === 0;
        }

        return false;
    }
}
