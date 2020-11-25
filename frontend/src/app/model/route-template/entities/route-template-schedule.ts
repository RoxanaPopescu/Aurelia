import { DayOfWeek } from "app/model/shared";
import { Duration, DateTime, IANAZone } from "luxon";
import { DateTimeRange } from "shared/types";
import clone from "clone";
import { RouteStatus } from "app/model/route";

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
            this.executeDayOfWeek = data.executeDayOfWeek;
            this.executeTime = Duration.fromObject({ seconds: data.executeTime });
            this.nextExecution = DateTime.fromISO(data.nextExecution, { setZone: true });
            this.activeDateTimeRange = new DateTimeRange(data.activeDateTimeRange);
            this.routeDayOfWeek = data.routeDayOfWeek;
            this.routeDriverId = data.routeDriverId;
            this.routeStatus = new RouteStatus(data.routeStatus);
            this.timeZone = new IANAZone(data.timeZone);
        }
        else
        {
            this.paused = false;
            this.activeDateTimeRange = new DateTimeRange();
            this.timeZone = new IANAZone("Europe/Copenhagen");
        }
    }

    /**
     * The ID of the route template schedule.
     */
    public id: string;

    /**
     * The IANA Time Zone Identifier for the time zone associated with the schedule.
     */
    public timeZone: IANAZone;

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
    public activeDateTimeRange?: DateTimeRange;

    /**
     * The day of the week for the route to be created
     */
    public routeDayOfWeek: DayOfWeek;

    /**
     * The Driver id to use for the route.
     */
    public routeDriverId: string | undefined;

    /**
     * The status of the rout to create
     */
    public routeStatus: RouteStatus | undefined;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;
        data.routeStatus = this.routeStatus?.slug;
        data.executeTime = this.executeTime.as("seconds");

        if (
            data.activeDateTimeRange?.from == null &&
            data.activeDateTimeRange?.to == null
        )
        {
            delete data.activeDateTimeRange;
        }

        data.timeZone = this.timeZone.name;

        return data;
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}
