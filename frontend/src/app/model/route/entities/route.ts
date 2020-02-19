import { RouteBase as AbstractRoute } from "./route-base";
import { RouteStopInfo } from "./route-stop-info";
import { RouteStop } from "./route-stop";
import { RoutePrice } from "./route-price";
import { WeightRange } from "app/model/shared";

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
            .map((s, i: number) => s.hidden ? new RouteStopInfo(s, i) : new RouteStop(s, i + 1));

        super(data, stops);

        this.overallRating = data.overallRating;
        this.driverListUrl = data.driverListUrl;
        this.driverInstructions = data.driverInstructions;
        this.tags = data.tags;
        this.allowAssignment = data.allowAssignment;

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
     * True if the route may be assigned to a fulfiller or driver, otherwise false.
     */
    public allowAssignment: boolean;

    /**
     * The total number colli associated with pickups on non-cancelled stops on the route.
     */
    public get totalColliCount(): number
    {
        return this.accessibleStops
            .filter(s => s.status.slug !== "cancelled")
            .reduce((total, s) => total + s.pickups.reduce((t, d) => t + d.colli.length, 0), 0);
    }
}
