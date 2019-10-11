import { Duration } from "luxon";
import { DayOfWeek } from "../types/day-of-week";

/**
 * Represents a day and time during the week.
 */
export class TimeOfWeek
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.dayOfWeek = data.dayOfWeek;

            if (data.timeOfDay != null)
            {
                if (typeof data.timeOfDay === "number")
                {
                    this.timeOfDay = Duration.fromObject({ seconds: data.timeOfDay });
                }
                else if (data.timeOfDay.startsWith("P"))
                {
                    this.timeOfDay = Duration.fromISO(data.timeOfDay);
                }
                else
                {
                    const parts = data.timeOfDay.split(/:/g);
                    this.timeOfDay = Duration.fromObject(
                    {
                        hours: parseInt(parts[0] || "0"),
                        minutes: parseInt(parts[1] || "0"),
                        seconds: parseFloat(parts[2] || "0")
                    });
                }
            }
        }
    }

    /**
     * The day of the week.
     */
    public dayOfWeek: DayOfWeek;

    /**
     * The time of the day.
     */
    public timeOfDay: Duration;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            dayOfWeek: this.dayOfWeek,
            timeOfDay: this.timeOfDay.as("seconds")
        };
    }
}
