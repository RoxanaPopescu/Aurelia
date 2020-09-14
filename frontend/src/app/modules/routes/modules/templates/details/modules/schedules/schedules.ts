import { autoinject, bindable } from "aurelia-framework";
import { RouteTemplate, RouteTemplateSchedule } from "app/model/route-template";
import { RouteStatus } from "app/model/route";

/**
 * Represents the page.
 */
@autoinject
export class Schedules
{

    /**
     * The template to present.
     */
    @bindable
    protected template: RouteTemplate;

    /**
     * The available statuses.
     */
    protected statuses = Object.keys(RouteStatus.values).map(slug => new RouteStatus(slug as any));

    /**
     * Called when a change is made to the recurrence settings for a specific weekday.
     * Ensures driver and status are not both selected, and triggers an update of the "All days" settings.
     * @param property The property that changed.
     */
    protected onWeekdayRecurrenceChanged(schedule: RouteTemplateSchedule, property: "enabled" | "driver" | "status"): void
    {
        switch (property)
        {
            case "driver":
            {
                schedule.routeStatus = undefined;

                break;
            }

            case "status":
            {
                schedule.routeStatus = undefined;

                break;
            }
        }

        // this.updateAllDay();
    }

    /**
     * Called when a change is made to the recurrence settings for "All days".
     * Ensures driver and status are not both selected, and sets the weekday settings for each weekday.
     * @param property The property that changed.
     */
    protected onAllDaysRecurrenceChanged(property: "enabled" | "driver" | "status"): void
    {
        let setDriverAndStatus = false;

        switch (property)
        {
            case "enabled":
            {
                /*
                for (const schedule of this.template.schedules)
                {
                    schedule.enabled = this.allDays.enabled;
                }
                */

                break;
            }

            case "driver":
            {
                /*
                if (this.allDays.driver != null)
                {
                    this.allDays.status = undefined;
                    setDriverAndStatus = true;
                }
                */

                break;
            }

            case "status":
            {
                /*
                if (this.allDays.status != null)
                {
                    this.allDays.driver = undefined;
                    setDriverAndStatus = true;
                }

                */

                break;
            }
        }

        if (setDriverAndStatus)
        {
            /*
            for (const schedule of this.template.schedules)
            {
                schedule.driver = this.allDays.driver;
                schedule.status = this.allDays.status;
            }
            */
        }
    }
}
