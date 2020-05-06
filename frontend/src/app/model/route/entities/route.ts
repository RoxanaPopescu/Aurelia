import { RouteBase as AbstractRoute } from "./route-base";
import { RouteStopInfo } from "./route-stop-info";
import { RouteStop } from "./route-stop";
import { RoutePrice } from "./route-price";
import { WeightRange } from "app/model/shared";
import { Outfit } from "app/model/outfit";

/**
 * Represents details about a route.
 */
export class Route extends AbstractRoute<RouteStop>
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        const stops = data.stops
            .map((s, i: number) => s.hidden ? new RouteStopInfo(s, i + 1) : new RouteStop(s, i + 1));

        super(data, stops);

        this.overallRating = data.overallRating;
        this.driverListUrl = data.driverListUrl;
        this.driverInstructions = data.driverInstructions;
        this.tags = data.tags;

        if (data.owner != null)
        {
            this.owner = new Outfit(data.owner);
        }

        if (data.totalWeightRange != null)
        {
            this.totalWeightRange = new WeightRange(data.totalWeightRange);
        }

        if (data.priceOverview != null)
        {
            this.priceOverview = new RoutePrice(data.priceOverview);
        }
    }

    /**
     * The price overview for the route.
     */
    public readonly priceOverview?: RoutePrice;

    /**
     * The overall rating of this route, calculated based on the ratings given at each stop.
     */
    public readonly overallRating?: number;

    /**
     * The link for the driver list document, formatted for printing.
     */
    public readonly driverListUrl?: string;

    /**
     * The tags associated with the route.
     */
    public readonly tags: string[];

    /**
     * The total weight range for the colli in the order.
     */
    public readonly totalWeightRange?: WeightRange;

    /**
     * The instructions the driver should follow, if any.
     */
    public readonly driverInstructions?: string;

    /**
     * The owner of this route, only exist if all stops belongs to this outfit.
     */
    public readonly owner?: Outfit;

    /**
     * The total number colli associated with pickups on non-cancelled stops on the route.
     */
    public get totalColliCount(): number
    {
        return this.stops
            .filter(s => s instanceof RouteStop && s.status.slug !== "cancelled")
            .reduce((total, s: RouteStop) => total + s.pickups.reduce((t, p) => t + p.colli.length, 0), 0);
    }

    /**
     * The total weight of all pickup colli for this route, can be undefined if no colli has weight.
     * In the future all colli should have a weight and dimension!
     */
    public get totalWeight(): number | undefined {
        let weight = 0;

        const stops = this.stops.filter(s => s instanceof RouteStop) as RouteStop[];
        for (const stop of stops) {
            for (const pickup of stop.pickups) {
                weight += pickup.totalWeight ?? 0;
            }
        }

        return weight > 0 ? weight : undefined;
    }

    /**
     * The total volume of all pickup colli for this route, can be undefined if no colli has dimensions.
     * In the future all colli should have a weight and dimension!
     */
    public get totalVolume(): number | undefined {
        let volume = 0;

        const stops = this.stops.filter(s => s instanceof RouteStop) as RouteStop[];
        for (const stop of stops) {
            for (const pickup of stop.pickups) {
                volume += pickup.totalVolume ?? 0;
            }
        }

        return volume > 0 ? volume : undefined;
    }
}
