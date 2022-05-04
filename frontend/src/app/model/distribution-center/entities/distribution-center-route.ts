import { DateTime } from "luxon";
import { DistributionCenterRouteRemark } from "./distribution-center-route-remark";
import { SearchModel } from "app/model/search-model";
import { DriverInfo } from "app/model/driver";

/**
 * Represents a route associated with a distribution center.
 */
export class DistributionCenterRoute
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.slug = data.slug;
        this.reference = data.reference;
        this.gate = data.gate;
        this.driverId = data.driverId;
        this.fulfillerName = data.fulfillerName;
        this.plannedArrival = DateTime.fromISO(data.plannedArrival, { setZone: true });
        this.plannedDeparture = DateTime.fromISO(data.plannedDeparture, { setZone: true });
        this.colliScanned = data.colliScanned;
        this.colliTotal = data.colliTotal;
        this.driverListReady = data.driverListReady;

        if (data.driverListUrl != null)
        {
            const url = new URL(data.driverListUrl);
            url.searchParams.set("locale", ENVIRONMENT.locale);
            this.driverListUrl = url.toString();
        }

        if (data.driver)
        {
            this.driver = new DriverInfo(
            {
                ...data.driver,
                phone:
                {
                    countryCallingCode: data.countryPrefix?.replace(/\+|\s/g, ""),
                    nationalNumber: data.number?.replace(/\s/g, "")
                }
            });
        }

        if (data.remarks != null)
        {
            this.remarks = data.remarks.remarkCodes.map(code => new DistributionCenterRouteRemark(code));
            this.note = data.remarks.note;
        }
        else
        {
            this.remarks = [];
        }

        if (data.actualArrival != null)
        {
            this.actualArrival = DateTime.fromISO(data.actualArrival, { setZone: true });
        }

        if (data.actualDeparture != null)
        {
            this.actualDeparture = DateTime.fromISO(data.actualDeparture, { setZone: true });
        }
    }

    public readonly id: string;
    public readonly slug: string;
    public readonly reference: string;
    public readonly driver: DriverInfo;
    public readonly gate: string;
    public readonly driverId: string;
    public readonly fulfillerName: string;
    public readonly plannedArrival: DateTime;
    public readonly plannedDeparture: DateTime;
    public readonly actualArrival: DateTime | undefined;
    public readonly actualDeparture: DateTime | undefined;
    public readonly colliScanned: number;
    public readonly colliTotal: number;
    public readonly driverListReady: boolean;
    public readonly driverListUrl: string;
    public remarks: DistributionCenterRouteRemark[];
    public note: string | undefined;

    /**
     * True if the actual arrival is later than the planned arrival, otherwise false.
     */
    public get hasDelayedArrival(): boolean
    {
        return this.actualArrival != null && this.actualArrival.valueOf() > this.plannedArrival.valueOf();
    }

    /**
     * True if the actual departure is later than the planned departure, otherwise false.
     */
    public get hasDelayedDeparture(): boolean
    {
        return this.actualDeparture != null && this.actualDeparture.valueOf() > this.plannedDeparture.valueOf();
    }

    /**
     * True if the route has one or more remarks, otherwise false.
     */
    public get hasRemarks(): boolean
    {
        return this.remarks.length > 0;
    }

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);
}
