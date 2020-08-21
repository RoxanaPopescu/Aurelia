import { RouteTemplateInfo } from "./route-template-info";
import { RouteTemplateSchedule } from "./route-template-schedule";
import { RouteTemplateStop } from "./route-template-stop";

/**
 * Represents details about a route template.
 */
export class RouteTemplate extends RouteTemplateInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        super(data);

        if (data != null)
        {
            this.schedules = data.schedules.map(r => new RouteTemplateSchedule(r));
            this.stops = data.stops.map((s, i: number) => new RouteTemplateStop(s, i + 1));
        }
        else
        {
            this.schedules = [];
            this.stops = [];
        }
    }

    /**
     * The schedules settings to use for the template.
     */
    public schedules: RouteTemplateSchedule[];

    /**
     * The stops to use for routes based on this template.
     */
    public stops: RouteTemplateStop[];
}
