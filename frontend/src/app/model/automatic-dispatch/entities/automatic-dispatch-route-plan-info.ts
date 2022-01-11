import { DateTime } from "luxon";
import { AutomaticDispatchJobStatus } from "../entities/automatic-dispatch-job-status";

/**
 * Represents info about a automatic dispatch route plan.
 */
export class AutomaticDispatchRoutePlanInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.name = data.name;
        this.status = new AutomaticDispatchJobStatus(data.status);
        this.created = DateTime.fromISO(data.created, { setZone: true });

        if (data.routesCount != null)
        {
            this.routesCount = data.routesCount;
        }

        if (data.unscheduledShipmentsCount != null)
        {
            this.unscheduledShipmentsCount = data.unscheduledShipmentsCount;
        }
    }

    /**
     * The id identifying the route plan.
     */
    public readonly id: string;

    /**
     * The name identifying the route plan.
     */
    public readonly name: string;

    /**
     * The status of the route plan.
     */
    public readonly status: AutomaticDispatchJobStatus;

    /**
     * The date and time at which the route plan was created.
     */
    public readonly created: DateTime;

    /**
     * The number of routes in the route plan.
     */
    public readonly routesCount?: number;

    /**
     * The number of unscheduled shipments in the route plan.
     */
    public readonly unscheduledShipmentsCount?: number;
}
