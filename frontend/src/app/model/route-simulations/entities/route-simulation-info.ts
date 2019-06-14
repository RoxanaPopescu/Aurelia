import { DateTime } from "luxon";

/**
 * Represents info about a route simulation.
 */
export class RouteSimulationInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.created = DateTime.fromISO(data.created, { setZone: true });
        this.name = data.name;
    }

    public readonly id: string;
    public readonly created: DateTime | undefined;
    public readonly name: string;
}
