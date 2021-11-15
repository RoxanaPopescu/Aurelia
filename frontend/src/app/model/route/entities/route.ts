import { RouteBase as AbstractRoute } from "./route-base";
import { RouteStopInfo } from "./route-stop-info";
import { RouteStop } from "./route-stop";
import { RoutePrice } from "./route-price";
import { WeightRange } from "app/model/shared";
import clone from "clone";

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

        for (const stop of stops)
        {
            stop.route = this;
        }

        this.supportNote = data.supportNote;
        this.overallRating = data.overallRating;
        this.driverInstructions = data.driverInstructions;

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
     * The total weight range for the colli in the order.
     */
    public readonly totalWeightRange?: WeightRange;

    /**
     * The instructions the driver should follow, if any.
     */
    public readonly driverInstructions?: string;

    /**
     * The support note for this route.
     * Usually used for writing information about the driver
     */
    public supportNote?: string;

    /**
     * The total weight of all pickup colli for this route, can be undefined if no colli has weight.
     * In the future all colli should have a weight and dimension!
     */
    public get totalWeight(): number | undefined
    {
        let weight = 0;
        const stops = this.stops.filter(s => s instanceof RouteStop) as RouteStop[];

        for (const stop of stops)
        {
            for (const pickup of stop.pickups)
            {
                weight += pickup.totalWeight ?? 0;
            }
        }

        return weight > 0 ? weight : undefined;
    }

    /**
     * The total volume of all pickup colli for this route, can be undefined if no colli has dimensions.
     * In the future all colli should have a weight and dimension!
     */
    public get totalVolume(): number | undefined
    {
        let volume = 0;
        const stops = this.stops.filter(s => s instanceof RouteStop) as RouteStop[];

        for (const stop of stops)
        {
            for (const pickup of stop.pickups)
            {
                volume += pickup.totalVolume ?? 0;
            }
        }

        return volume > 0 ? volume : undefined;
    }

    public clone(): any
    {
        return clone(this);
    }

    public toJSON(): any
    {
        return {
            id: this.id,
            driverInstructions: this.driverInstructions,
            tags: this.tags,
            productType: this.productType,
            reference: this.reference,
            vehicleType: this.vehicleType.id
        };
    }
}
