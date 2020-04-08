import { DateTime } from "luxon";
import { DateTimeRange } from "shared/types";
import { LegacyRoutePlanStatus } from "./legacy-route-plan-status";

/**
 * Represents info about a route plan.
 */
export class LegacyRoutePlanInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.slug = data.id;
        this.status = new LegacyRoutePlanStatus(data.status);
        this.createdDateTime = DateTime.fromISO(data.created, { setZone: true });
        this.updatedDateTime = DateTime.fromISO(data.lastUpdated, { setZone: true });
        this.routeCount = data.routeCount;
        this.unscheduledStopCount = data.unscheduledStopsCount;
        this.timeFrame = new DateTimeRange(data.timeFrame, { setZone: true });
    }

    /**
     * The slug identifying the route plan.
     */
    public readonly slug: string;

    /**
     * The status of the route plan.
     */
    public readonly status: LegacyRoutePlanStatus;

    /**
     * The date and time at which the route plan was created.
     */
    public readonly createdDateTime: DateTime;

    /**
     * The date and time at which the route plan was last updated.
     */
    public readonly updatedDateTime: DateTime;

    /**
     * The number of routes in the route plan.
     */
    public readonly routeCount: number;

    /**
     * The number of unscheduled stops in the route plan.
     */
    public readonly unscheduledStopCount: number;

    /**
     * The time frame for this route plan.
     */
    public readonly timeFrame: DateTimeRange;
}