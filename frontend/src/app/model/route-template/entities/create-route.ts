import { Driver } from "app/model/driver";
import { RouteStatus } from "app/model/route";
import { DateTime } from "luxon";
import { Uuid } from "shared/utilities/id/uuid";
import { RouteTemplate } from "../entities/route-template";

export class CreateRoute
{
    /**
     * Creates a new instance of the type.
     * @param template The route template for this route.
     */
    public constructor(template: RouteTemplate)
    {
        this.template = template;
    }

    /**
     * The template.
     */
    protected template: RouteTemplate;

    /**
     * The jobId that is used so that the same route is not created multiple times.
     */
    protected jobId: string = Uuid.v4();

    /**
     * The date of which the route is executed
     */
    public date?: DateTime;

    /**
     * The status of the created route
     */
    public status?: RouteStatus;

    /**
     * The driver for the route
     */
    public driver?: Driver;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;

        if (data.driver != null)
        {
            data.driverId = data.driver.id;
            delete data.driver;
        }

        data.templateId = data.template.id;
        delete data.template;

        return data;
    }
}
