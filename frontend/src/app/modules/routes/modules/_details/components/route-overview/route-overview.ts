import { autoinject, computedFrom, bindable } from "aurelia-framework";
import { Route, RouteStop } from "app/model/route";
import { ColloStatus } from "app/model/collo";

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
    public get pickedUpColliCount(): number {
        let pickedUpColliCount = 0;
        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
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
    public get deliveredColliCount(): number {
        let deliveredColliCount = 0;
        if (this.route != null)
        {
            this.route.stops
                .filter(s => s instanceof RouteStop)
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
    public get totalColliCount(): number {
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
}
