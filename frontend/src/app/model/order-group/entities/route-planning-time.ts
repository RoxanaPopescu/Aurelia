import { DateTime, Zone } from "luxon";
import { TimeOfWeek, TimeOfWeekRange } from "app/model/shared";

/**
 * Represents the time at which route planning should run, for orders
 * that to be delivered within a specific time of the week.
 */
export class RoutePlanningTime
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.delivery = new TimeOfWeekRange(data.delivery);
            this.planning = new TimeOfWeek(data.planning);
            this.nextPlanning = DateTime.fromISO(data.nextPlanning, { setZone: true });
            this.status = data.status.name.toLowerCase();
        }
        else
        {
            this.delivery = new TimeOfWeekRange();
            this.planning = new TimeOfWeek();
            this.status = "ready";
        }
    }

    /**
     * The delivery times of week for which this route planning time should be used.
     */
    public delivery: TimeOfWeekRange;

    /**
     * The time of week at which route planning should run for orders matching the order group.
     */
    public planning: TimeOfWeek;

    /**
     * The date and time of the next route planning run.
     * Note that the UTC offset for this date matches the offset of the zone associated with the order group.
     */
    public nextPlanning: DateTime;

    /**
     * The status of the planned schedule
     */
    public status: "processing" | "ready";

    /**
     * Changes the time zone associated with this route planning time.
     * @param timeZone The new time zone to use.
     */
    public changeTimeZone(timeZone: Zone): any
    {
        this.nextPlanning = this.nextPlanning.setZone(timeZone, { keepLocalTime: true });
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return new RoutePlanningTime(
        {
            ...JSON.parse(JSON.stringify(this)),
            status: { name: this.status }
        });
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            delivery: this.delivery,
            planning: this.planning,
            nextPlanning: this.nextPlanning
        };
    }
}
