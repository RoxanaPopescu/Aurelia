import { RouteStatus } from "./route-status";
import { DayOfWeek } from "app/model/shared";
import { Duration, DateTime } from "luxon";
import { DateTimeRange } from "shared/types";
import clone from "clone";

/**
 * Represents the recurrence settings to use for a template.
 */
export class RouteTemplateSchedule
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.paused = data.paused;
            this.id = data.id;

            if (data.driverId != null)
            {
                // this.driver = new Driver(data.driver);
                // FIXME -> How - to?
            }

            this.routeStatus = new RouteStatus(data.routeStatus);
        }
        else
        {
            this.paused = false;
        }
    }

    /**
     * The ID of the route template schedule.
     */
    public id: string;

    /**
     * True if this recurrence is paused, otherwise false.
     */
    public paused: boolean;

    /**
     * The day of the week this schedule is being executed
     */
    public executeDayOfWeek: DayOfWeek;

    /**
     * The time of day at which this schedule is being executed.
     */
    public executeTime: Duration;

    /**
     * The next dateTime where this schedule is being executed.
     */
    public nextExecution: DateTime;

    /**
     * The time range of which this is active.
     */
    public activeTimeRange?: DateTimeRange;

    /**
     * The day of the week for the route to be created
     */
    public routeDayOfWeek: DayOfWeek;

    /**
     * The Driver id to use for the route.
     */
    public routedriverId: number | undefined;

    /**
     * The status of the rout to create
     */
    public routeStatus: RouteStatus | undefined;

    /**
     * Gets the data representing this instance.
    public toJSON(): any
    {
        return {
            routedriverId: this.driver != null ? this.driver.id : undefined,
            status: this.status != null ? this.status.slug : undefined
        };
    }
    */

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}
