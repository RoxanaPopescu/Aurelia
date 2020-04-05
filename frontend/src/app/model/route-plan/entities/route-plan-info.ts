import { DateTime } from "luxon";
import { DateTimeRange } from "shared/types";
import { RoutePlanStatus } from "./route-plan-status";

/**
 * Represents info about a route plan.
 */
export class RoutePlanInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.slug = data.id;
        this.status = new RoutePlanStatus(data.status);
        this.timeCreated = DateTime.fromISO(data.timeCreated, { setZone: true });

        if (data.timeCompleted != null)
        {
            this.timeCompleted = DateTime.fromISO(data.timeCompleted, { setZone: true });
        }

        if (data.routesCount != null)
        {
            this.routesCount = data.routesCount;
        }

        if (data.unscheduledTasksCount != null)
        {
            this.unscheduledTasksCount = data.unscheduledTasksCount;
        }

        this.deliveryTime = new DateTimeRange(data.deliveryTime, { setZone: true });
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
    public readonly timeCreated: DateTime;

    /**
     * The date and time at which the route plan was completed.
     */
    public readonly timeCompleted?: DateTime;

    /**
     * The number of routes in the route plan.
     */
    public readonly routesCount?: number;

    /**
     * The number of unscheduled tasks in the route plan.
     */
    public readonly unscheduledTasksCount?: number;

    /**
     * The delivery time frame for this route plan
     */
    public readonly deliveryTime: DateTimeRange;
}
