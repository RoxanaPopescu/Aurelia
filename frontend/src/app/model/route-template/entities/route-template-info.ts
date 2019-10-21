import { DateTime } from "luxon";
import { Fulfiller, Consignor } from "app/model/outfit";

export class RouteTemplateInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.reference = data.reference;
        this.consignor = new Fulfiller(data.consignor);
        this.startDateTime = DateTime.fromISO(data.startDateTime, { setZone: true });
        this.endDateTime = DateTime.fromISO(data.endDateTime, { setZone: true });
    }

    /**
     * The ID of the route.
     */
    public readonly id: string;

    /**
     * The reference to use for routes based on this template.
     */
    public readonly reference?: string;

    /**
     * The consignor to use for routes based on this template.
     */
    public readonly consignor?: Consignor;

    /**
     * The date and time at which this template starts generating routes.
     */
    public readonly startDateTime: DateTime;

    /**
     * The date and time at which this template stops generating routes.
     */
    public readonly endDateTime: DateTime;
}
