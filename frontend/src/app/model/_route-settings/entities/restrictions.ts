import { Duration } from "luxon";
import { UturnStrategy } from "./uturn-strategy";
import { CurbApproachStrategy } from "./curb-approach-strategy";
import { TimeWindowAdjustment } from "./time-window-adjustment";

/**
 * Represents the restrictions that should be used during route optimization.
 */
export class Restrictions
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.ferriesAllowed = data.ferriesAllowed;
            this.privateRoadsAllowed = data.privateRoadsAllowed;
            this.highwaysAllowed = data.highwaysAllowed;
            this.uturnStrategy = new UturnStrategy(data.uturnStrategy);
            this.curbApproachStrategy = new CurbApproachStrategy(data.curbApproachStrategy);
            this.timeWindowAdjustment = new TimeWindowAdjustment(data.timeWindowAdjustment);
            this.oneRoutePlanPerStartLocation = data.oneRoutePlanPerStartLocation;
            this.maxCalculationTime = data.maxCalculationTime;
        }
        else
        {
            this.ferriesAllowed = true;
            this.privateRoadsAllowed = true;
            this.highwaysAllowed = true;
            this.uturnStrategy = new UturnStrategy("allowed");
            this.curbApproachStrategy = new CurbApproachStrategy("either-side-of-vehicle");
            this.timeWindowAdjustment = new TimeWindowAdjustment();
            this.oneRoutePlanPerStartLocation = true;
        }
    }

    /**
     * True to allow ferries, otherwise false.
     */
    public ferriesAllowed: boolean;

    /**
     * True to allow private routes, otherwise false.
     */
    public privateRoadsAllowed: boolean;

    /**
     * True to allow highways, otherwise false.
     */
    public highwaysAllowed: boolean;

    /**
     * The U-turn strategy to use.
     */
    public uturnStrategy: UturnStrategy;

    /**
     * The curb-approach strategy to use.
     */
    public curbApproachStrategy: CurbApproachStrategy;

    /**
     * The time window adjustments allowed during optimization,
     * in order to save cost or improve quality.
     */
    public timeWindowAdjustment: TimeWindowAdjustment;

    /**
     * True to produce one route plan per start location, otherwise false.
     */
    public oneRoutePlanPerStartLocation: boolean;

    /**
     * The timeout to use when calculating a route plan.
     */
    public maxCalculationTime: Duration;
}
