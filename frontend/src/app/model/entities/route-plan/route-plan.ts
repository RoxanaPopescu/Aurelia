import { DateTime } from "luxon";
import { DateTimeRange } from "shared/types";
import { RoutePlanStatus } from "./route-plan-status";

export class RoutePlan
{
    public constructor(data: any)
    {
        this.slug = data.id;
        this.status = new RoutePlanStatus(data.status);
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
    public readonly status: RoutePlanStatus;

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
