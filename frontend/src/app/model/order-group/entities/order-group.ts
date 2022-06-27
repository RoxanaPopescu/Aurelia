import { computedFrom } from "aurelia-framework";
import { IANAZone, DateTime } from "luxon";
import { EntityInfo } from "app/types/entity";
import { Consignor } from "app/model/outfit";
import { MatchingCriteria as MatchingCriteria } from "./matching-criteria";
import { RoutePlanningTime } from "./route-planning-time";
import { SearchModel } from "app/model/search-model";

/**
 * Represents an order group used for route planning.
 */
export class OrderGroup
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.etag = data.etag;
            this.id = data.id;
            this.name = data.name;
            this.paused = data.paused;
            this.timeZone = IANAZone.create(data.timeZone);
            this.matchingCriteria = data.matchingCriteria.map(d => new MatchingCriteria(d));
            this.routePlanningTimes = data.routePlanningTimes.map(d => new RoutePlanningTime(this.timeZone, d));
            this.routeOptimizationSettingsId = data.routeOptimizationSettingsId;
        }
        else
        {
            this.timeZone = IANAZone.create("Europe/Copenhagen");
            this.matchingCriteria = [];
            this.routePlanningTimes = [];
        }
    }

    /**
     * The entity tag used for optimistic concurrency control.
     */
    public etag: string;

    /**
     * The ID of the order group.
     */
    public readonly id: string;

    /**
     * The name of the order group.
     */
    public readonly name: string;

    /**
     * The name of the order group.
     */
    public routeOptimizationSettingsId?: string;

    /**
     * True if the order group is paused, otherwise false.
     */
    public paused: boolean;

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

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);

    /**
     * Gets a list of consignors associated with the order group.
     */
    @computedFrom("matchingCriterias")
    public get allConsignors(): Consignor[]
    {
        let consignors: Consignor[] = [];
        this.matchingCriteria.forEach(m => consignors = [...new Set(consignors.concat(m.organizations))]);

        return consignors;
    }

    /**
     * Gets a list of tags associated with the order group.
     */
    @computedFrom("matchingCriterias")
    public get allTags(): string[]
    {
        let tags: string[] = [];
        this.matchingCriteria.forEach(m => tags = [...new Set(tags.concat(m.tags))]);

        return tags;
    }

    /**
     * Gets the number of active planning times
     */
    @computedFrom("routePlanningTimes")
    public get activeSchedulesCount(): number
    {
        let activeCount = 0;
        for (const planningTime of this.routePlanningTimes)
        {
            if (planningTime.status === "processing")
            {
                activeCount++;
            }
        }

        return activeCount;
    }

    /**
     * Gets the next time route planning will execute for this order group.
     */
    @computedFrom("routePlanningTimes")
    public get nextPlanningTime(): DateTime
    {
        let dateTimes = this.routePlanningTimes.map(t => t.nextPlanning);
        dateTimes = dateTimes.sort((a, b) => a.toMillis() - b.toMillis());

        return dateTimes[0];
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            etag: this.etag,
            id: this.id,
            name: this.name,
            timeZone: this.timeZone.name,
            matchingCriteria: this.matchingCriteria,
            routePlanningTimes: this.routePlanningTimes,
            routeOptimizationSettingsId: this.routeOptimizationSettingsId
        };
    }

    /**
     * Gets an `EntityInfo` instance representing this instance.
     */
    public toEntityInfo(): EntityInfo
    {
        return new EntityInfo(
        {
            type: "order-group",
            id: this.id,
            name: this.name
        });
    }
}
