import { IANAZone } from "luxon";
import { MatchingCriteria as MatchingCriteria } from "./matching-criteria";
import { RoutePlanningTime } from "./route-planning-time";

/**
 * Represents an order group used for route planning.
 */
export class OrderGroup
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.etag = data.etag;
        this.id = data.id;
        this.name = data.name;
        this.paused = data.paused;
        this.timeZone = IANAZone.create(data.timeZone);
        this.matchingCriteria = data.matchingCriteria.map(d => new MatchingCriteria(d));
        this.routePlanningTimes = data.routePlanningTimes.map(d => new RoutePlanningTime(this.timeZone, d));
    }

    /**
     * The entity tag used for optimistic concurrency control.
     */
    protected readonly etag: string;

    /**
     * The ID of the order group.
     */
    public readonly id: string;

    /**
     * The name of the order group.
     */
    public readonly name: string;

    /**
     * True if the order group is paused, otherwise false.
     */
    public readonly paused: boolean;

    /**
     * The IANA Time Zone Identifier for the time zone associated with the order group.
     */
    public readonly timeZone: IANAZone;

    /**
     * The matching criteria for the group.
     */
    public readonly matchingCriteria: MatchingCriteria[];

    /**
     * The consignors to which the order group applies.
     */
    public readonly routePlanningTimes: RoutePlanningTime[];
}
