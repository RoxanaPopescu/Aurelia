import { RouteStatus } from "app/model/route/entities/route-status";
import { Driver } from "app/model/driver";

/**
 * Represents the recurrence settings to use for a template.
 */
export class RouteRecurrence
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.enabled = data.enabled;

            if (data.driver != null)
            {
                this.driver = new Driver(data.driver);
            }

            if (data.status != null)
            {
                this.status = new RouteStatus(data.driver);
            }
        }
        else
        {
            this.enabled = false;
        }
    }

    /**
     * True if this recurrence is enabled, otherwise false.
     */
    public enabled: boolean;

    /**
     * The ID of the driver to use for this recurrence.
     */
    public driver: Driver | undefined;

    /**
     * TODO: The status of the route ???
     */
    public status: RouteStatus | undefined;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            driverId: this.driver != null ? this.driver.id : undefined,
            status: this.status != null ? this.status.slug : undefined
        };
    }
}
