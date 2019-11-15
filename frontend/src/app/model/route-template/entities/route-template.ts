import { RouteTemplateInfo } from "./route-template-info";
import { RouteRecurrence } from "./route-recurrence";
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
            this.recurrence = data.recurrence.map(r => new RouteRecurrence(r));
            this.stops = data.stops.map(s => new RouteTemplateStop(s));
        }
        else
        {
            this.recurrence = Array(7).fill(null).map(i => new RouteRecurrence());
            this.stops = [];
        }
    }

    /**
     * The recurrence settings to use for the template.
     */
    public recurrence: RouteRecurrence[];

    /**
     * The stops to use for routes based on this template.
     */
    public stops: RouteTemplateStop[];
}
