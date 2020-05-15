import { DateTime } from "luxon";
import { Address } from "app/model/shared";
import { RouteBase } from "./route-base";
import { RouteStatusList } from "./route-status-list";

export class RouteInfo extends RouteBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        super(data, []);
        this.startDate = DateTime.fromISO(data.startDate, { setZone: true });
        this.endDate = DateTime.fromISO(data.endDate, { setZone: true });
        this.startAddress = new Address({ primary: data.startAddress });
        this.endAddress = new Address({ primary: data.endAddress });
        this.stopCount = data.stopCount;
        this.legacyStatus = new RouteStatusList(data.status);
    }

    /**
     * The date and time at which the route is planned to start.
     */
    public readonly startDate: DateTime;

    /**
     * The date and time at which the route is planned to end.
     */
    public readonly endDate: DateTime;

    /**
     * The address at which the route is planned to start.
     */
    public readonly startAddress: Address;

    /**
     * The address at which the route is planned to start.
     */
    public readonly endAddress: Address;

    /**
     * The number of stops on the route.
     */
    public readonly stopCount: number;

    /**
     * The number of stops on the route.
     */
    public readonly legacyStatus: RouteStatusList;
}
