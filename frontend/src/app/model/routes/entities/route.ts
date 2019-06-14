import { RouteBase as AbstractRoute, RouteStopInfo } from "app/model/routes";
import { RouteStop } from "./route-stop";
import { RoutePrice } from "./route-price";

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
        this.allowAssignment = data.allowAssignment;

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
     * True if the route may be assigned to a fulfiller or driver, otherwise false.
     */
    public allowAssignment: boolean;
}
