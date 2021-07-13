import { DateTime } from "luxon";

/**
 * Represents a stop identity.
 */
export class RouteStopIdentity
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.date = DateTime.fromISO(data.date, { setZone: true });
        this.name = data.name;
    }

    /**
     * The date and time at which the identity was captured.
     */
    public date: DateTime;

    /**
     * The name of the person providing the identity.
     */
    public name: string;
}
