import { EntityInfo } from "app/types/entity";
import { Restrictions } from "./restrictions";
import { RouteCreation } from "./route-creation";
import { VehicleGroup } from "./vehicle-group";
import { DepartureTime } from "./departure-time";
import { TaskTimes } from "./task-times";
import { SpecialArea } from "./special-area";
import { Metadata } from "app/model/shared/entities/metadata";
import { CollectionPoint } from "./collection-point";

/**
 * Represents a route planning rule set.
 */
export class RoutePlanningSettings
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.metadata = new Metadata(data.metadata);
            this.id = data.id;
            this.name = data.name;
            this.slug = data.slug;
            this.restrictions = new Restrictions(data.restrictions);
            this.routeCreation = new RouteCreation(data.routeCreation);
            this.vehicleGroups = data.vehicleGroups.map(d => new VehicleGroup(d));
            this.departureTimes = data.departureTimes.map(d => new DepartureTime(d));
            this.taskTimes = new TaskTimes(data.taskTimes);

            this.specialAreas = data.specialAreas.map(d => new SpecialArea(d));
            this.specialAreas.sort((a, b) => a.name.localeCompare(b.name));
        }
        else
        {
            this.metadata = new Metadata();
            this.restrictions = new Restrictions();
            this.routeCreation = new RouteCreation();
            this.vehicleGroups = [];
            this.departureTimes = [];
            this.taskTimes = new TaskTimes();
            this.specialAreas = [];
            this.collectionPoint = new CollectionPoint();
        }
    }

    /**
     * The metadata for the entity.
     */
    public metadata: Metadata;

    /**
     * The ID of the route planning settings.
     */
    public id: string;

    /**
     * The name of the route planning settings.
     */
    public name: string;

    /**
     * The slug identifying the route planning settings.
     */
    public slug: string;

    /**
     * The restrictions to use during route planning.
     */
    public restrictions: Restrictions;

    /**
     * The settings to use when creating routes.
     */
    public routeCreation: RouteCreation;

    /**
     * The vehicle groups to use.
     */
    public vehicleGroups: VehicleGroup[];

    /**
     * The departure time rules to use.
     */
    public departureTimes: DepartureTime[];

    /**
     * The task time rules to use.
     */
    public taskTimes: TaskTimes;

    /**
     * The special area rules to use.
     */
    public specialAreas: SpecialArea[];

    /**
     * The settings controlling the creation of collection points.
     */
    public collectionPoint: CollectionPoint;

    /**
     * Gets an `EntityInfo` instance representing this instance.
     */
    public toEntityInfo(): EntityInfo
    {
        return new EntityInfo(
        {
            type: "route-planning-rule-set",
            id: this.id,
            slug: this.slug,
            name: this.name
        });
    }
}
