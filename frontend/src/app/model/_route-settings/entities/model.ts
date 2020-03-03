import { DateTimeRange, GeoJsonPolygon } from "shared/types";
import { Duration } from "luxon";
import { DayOfWeek, Location } from "app/model/shared";
import { VehicleType } from "app/model/vehicle";
import { UturnStrategy } from "./uturn-strategy";
import { CurbApproachStrategy } from "./curb-approach-strategy";

/**
 * Represents a route optimization rule set.
 */
export class RouteOptimizationSettings
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.name = data.name;
            this.slug = data.slug;
            this.restrictions = new Restrictions(data.restrictions);
            this.routeCreation = new RouteCreation(data.routeCreation);
            this.vehicleGroups = data.vehicleGroups.map(d => new VehicleGroup(d));
            this.departureTimes = data.departureTimes.map(d => new DepartureTime(d));
            this.taskTimes = new TaskTimes(data.taskTimes);
            this.specialAreas = data.specialAreas.map(d => new SpecialArea(d));
        }
        else
        {
            this.restrictions = new Restrictions();
            this.routeCreation = new RouteCreation();
            this.vehicleGroups = [];
            this.departureTimes = [];
            this.taskTimes = new TaskTimes();
            this.specialAreas = [];
        }
    }

    /**
     * The ID of the route optimization settings.
     */
    public id: string;

    /**
     * The name of the route optimization settings.
     */
    public name: string;

    /**
     * The slug identifying the route optimization settings.
     */
    public slug: string;

    /**
     * The restrictions to use during route optimization.
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
}

/**
 * Represents settings related to a special area.
 */
export class SpecialArea
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.name = data.name;
            this.color = data.color;
            this.polygon = data.polygon;
            this.scenarios = data.scenarios;
        }
        else
        {
            this.scenarios = [];

            // TODO: How do we assign a color?
        }
    }

    /**
     * The name of the special area.
     */
    public name: string;

    /**
     * The index of the color to use when presenting the area.
     */
    public color: number;

    /**
     * The polygon defining the geographical area.
     */
    public polygon: GeoJsonPolygon;

    /**
     * The scenarios in which settings should be applied.
     */
    public scenarios: SpecialAreaScenario[];
}

/**
 * Represents a special area scenario.
 */
export class SpecialAreaScenario
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.criteria = new SpecialAreaCriteria(data.criteria);
            this.taskTimeChange = data.taskTimeChange;
            this.drivingTimeChangeFactor = data.drivingTimeChangeFactor;
            this.isBlocked = data.isBlocked;
        }
        else
        {
            this.criteria = new SpecialAreaCriteria();
            this.isBlocked = false;
        }
    }

    /**
     * The matching criteria for the scenario.
     */
    public criteria: SpecialAreaCriteria;

    /**
     * The time to add to the task time.
     */
    public taskTimeChange: number;

    /**
     * The facter with which the driving time should be multiplied.
     */
    public drivingTimeChangeFactor: number;

    /**
     * True if the area is inaccessible, otherwise false.
     */
    public isBlocked: boolean;
}

/**
 * Represents the matching criteria for a special area scenario.
 */
export class SpecialAreaCriteria
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.weekdays = data.weekdays;
            this.datePeriod = data.datePeriod;
            this.orderTagsAllRequired = data.orderTagsAllRequired;
            this.orderTagsOneRequired = data.orderTagsOneRequired;
        }
        else
        {
            this.weekdays = [];
            this.datePeriod = new DateTimeRange();
            this.orderTagsAllRequired = [];
            this.orderTagsOneRequired = [];
        }
    }

    /**
     * The weekdays matched by this criteria.
     */
    public weekdays: DayOfWeek[];

    /**
     * The date range matched by this criteria.
     */
    public datePeriod: DateTimeRange;

    /**
     * The order tags matched by this criteria, where all the specified tags must match.
     */
    public orderTagsAllRequired: string[];

    /**
     * The order matched by this criteria, where at least one of the specified tags match.
     */
    public orderTagsOneRequired: string[];
}

/**
 * Represents settings related to task times.
 */
export class TaskTimes
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.base = new TaskTimesAdditionalTime(data.base);
            this.roundDefinition = new TaskTimesRoundDefinition(data.roundDefinition);
            this.scenarios = data.scenarios.map(d => new TaskTimesScenario(d));
        }
        else
        {
            this.base = new TaskTimesAdditionalTime();
            this.roundDefinition = new TaskTimesRoundDefinition();
            this.scenarios = [];
        }
    }

    /**
     * The additional time to add, if no scenario matches.
     */
    public base: TaskTimesAdditionalTime;

    /**
     * The round definition, which describes how much the driver can carry.
     */
    public roundDefinition: TaskTimesRoundDefinition;

    /**
     * The scenarios in which settings should be applied.
     */
    public scenarios: TaskTimesScenario[];
}

/**
 * Represents a task time scenario.
 */
export class TaskTimesScenario
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.criteria = new TaskTimesCriteria(data.criteria);
            this.additionalTime = new TaskTimesAdditionalTime(data.additionalTime);
        }
        else
        {
            this.criteria = new TaskTimesCriteria();
            this.additionalTime = new TaskTimesAdditionalTime();
        }
    }

    /**
     * The matching criteria for the scenario.
     */
    public criteria: TaskTimesCriteria;

    /**
     * The additional task time to add.
     */
    public additionalTime: TaskTimesAdditionalTime;
}

/**
 * Represents the matching criteria for a task times scenario.
 */
export class TaskTimesCriteria
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.orderTagsAllRequired = data.orderTagsAllRequired;
            this.orderTagsOneRequired = data.orderTagsOneRequired;
        }
        else
        {
            this.orderTagsAllRequired = [];
            this.orderTagsOneRequired = [];
        }
    }

    /**
     * The order tags matched by this criteria, where all the specified tags must match.
     */
    public orderTagsAllRequired: string[];

    /**
     * The order matched by this criteria, where at least one of the specified tags match.
     */
    public orderTagsOneRequired: string[];
}

/**
 * Represents additional task time.
 */
export class TaskTimesAdditionalTime
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.initial = data.initial;
            this.perFloor = data.perFloor;
            this.perRound = data.perRound;
        }
    }

    /**
     * The initial time to add.
     */
    public initial: number;

    /**
     * The time to add for each floor.
     */
    public perFloor: number;

    /**
     * The time to add for each round at the ground floor.
     */
    public perRound: number;
}

/**
 * Represents the definition of a round, which describes how much the driver can carry.
 */
export class TaskTimesRoundDefinition
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.colliPerRound = data.colliPerRound;
            this.weightPerRound = data.weightPerRound;
            this.volumePerRound = data.volumePerRound;
        }
    }

    /**
     * The max colli that can be transported in a round.
     */
    public colliPerRound: number;

    /**
     * The max weight that can be transported in a round.
     */
    public weightPerRound: number;

    /**
     * The max volume that can be transported in a round.
     */
    public volumePerRound: number;
}

/**
 * Represents settings related to a departure time.
 */
export class DepartureTime
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.startLocation = new Location(data.startLocation);
            this.scenarios = data.scenarios.map(d => new DepartureTimeScenario(d));
        }
        else
        {
            this.startLocation = new Location();
            this.scenarios = [];
        }
    }

    /**
     * The location from which the driver must depart.
     */
    public startLocation: Location;

    /**
     * The scenarios in which settings should be applied.
     */
    public scenarios: DepartureTimeScenario[];
}

/**
 * Represents a departure time scenario.
 */
export class DepartureTimeScenario
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.name = data.name;
            this.criteria = new DepartureTimeCriteria(data.criteria);
            this.ports = data.ports.map(d => new Port(d));
        }
        else
        {
            this.criteria = new DepartureTimeCriteria();
            this.ports = [];
        }
    }

    /**
     * The name of the scenario.
     */
    public name: string;

    /**
     * The matching criteria for the scenario.
     */
    public criteria: DepartureTimeCriteria;

    /**
     * The ports associated with the scenario.
     */
    public ports: Port[];
}

/**
 * Represents a port associated with a departure time scenario.
 */
export class Port
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.name = data.name;
            this.slots = data.slots;
        }
        else
        {
            this.slots = [];
        }
    }

    /**
     * The name identifying the port.
     */
    public name: string;

    /**
     * The slots associated with the port.
     */
    public slots: PortSlot[];
}

/**
 * Represents a slot associated with a port.
 */
export class PortSlot
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.arrivalTime = data.arrivalTime;
            this.lastDepartureTime = data.lastDepartureTime;
            this.timeBetweenDepartures = data.timeBetweenDepartures;
            this.vehicleGroupId = data.vehicleGroupId;
        }
    }

    /**
     * The time at which the vehicle should arrive at the port.
     */
    public arrivalTime: string;

    /**
     * The time at which the vehicle must depart the port.
     */
    public lastDepartureTime: string;

    /**
     * The time between two arrival times, used for loading and preparing the gate for next arrival.
     */
    public timeBetweenDepartures: number;

    /**
     * The vehicle group to which the vehicle should belong.
     */
    public vehicleGroupId: string;
}

/**
 * Represents the matching criteria for a departure time scenario.
 */
export class DepartureTimeCriteria
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.weekdays = data.weekdays;
            this.datePeriod = new DateTimeRange(data.datePeriod);
        }
        else
        {
            this.datePeriod = new DateTimeRange();
        }
    }

    /**
     * The weekdays matched by this criteria.
     */
    public weekdays: DayOfWeek[];

    /**
     * The date range matched by this criteria.
     */
    public datePeriod: DateTimeRange;
}

/**
 * Represents settings associated with a vehicle group.
 */
export class VehicleGroup
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.name = data.name;
            this.id = data.id;
            this.cost = new VehicleGroupCost(data.cost);
            this.vehicleType = VehicleType.get(data.vehicleTypeId);
            this.limits = new VehicleGroupLimits(data.limits);
            this.orderTagsAllRequired = data.orderTagsAllRequired;
            this.orderTagsOneRequired = data.orderTagsOneRequired;
            this.startLocation = new VehicleGroupLocation(data.startLocation);
            this.endLocation = new VehicleGroupLocation(data.endLocation);
            this.routeTags = data.routeTags;
        }
        else
        {
            this.cost = new VehicleGroupCost();
            this.limits = new VehicleGroupLimits();
            this.orderTagsAllRequired = [];
            this.orderTagsOneRequired = [];
            this.startLocation = new VehicleGroupLocation();
            this.endLocation = new VehicleGroupLocation();
            this.routeTags = [];
        }
    }

    /**
     * The name of the vehicle group.
     */
    public name: string;

    /**
     * The ID of the vehicle group.
     */
    public id: string;

    /**
     * The cost associated with the vehicle group.
     */
    public cost: VehicleGroupCost;

    /**
     * The vehicle type associated with the vehicle group.
     */
    public vehicleType: VehicleType;

    /**
     * The limits associated with the vehicle group.
     */
    public limits: VehicleGroupLimits;

    /**
     * The order tags matched by this criteria, where all the specified tags must match.
     */
    public orderTagsAllRequired: string[];

    /**
     * The order matched by this criteria, where at least one of the specified tags match.
     */
    public orderTagsOneRequired: string[];

    /**
     * The start location associated with the vehicle group.
     */
    public startLocation: VehicleGroupLocation;

    /**
     * The end location associated with the vehicle group.
     */
    public endLocation: VehicleGroupLocation;

    /**
     * The route tags to associate with routes using this vehicle group.
     */
    public routeTags: string[];
}

/**
 * Represents the start location associated with a vehicle group.
 */
export class VehicleGroupLocation
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.location = new Location(data.location);
            this.taskTime = data.taskTime;
        }
        else
        {
            this.location = new Location();
        }
    }

    /**
     * The start location.
     */
    public location: Location;

    /**
     * The task time at this location.
     */
    public taskTime: number;
}

/**
 * Represents the limits associated with a vehicle group.
 */
export class VehicleGroupLimits
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.volume = data.volume;
            this.weight = data.weight;
            this.colliCount = data.colliCount;
            this.stopCount = data.stopCount;
            this.time = data.time;
            this.distance = data.distance;
        }
    }

    /**
     * The max volume the vehicle can handle, in ㎡.
     */
    public volume: number;

    /**
     * The max weight the vehicle can handle, in kg.
     */
    public weight: number;

    /**
     * The max number of colli the vehicle can handle.
     */
    public colliCount: number;

    /**
     * The max number of stops the vehicle can handle.
     */
    public stopCount: number;

    /**
     * The max route duration the vehicle can handle.
     */
    public time: number;

    /**
     * The max route distance the vehicle can handle.
     */
    public distance: number;
}

/**
 * Represents the cost associated with a vehicle group.
 * Note that the cost values must be positive numbers, where the cost is defined
 * by the relative size of the numbers, not by their absolute values.
 */
export class VehicleGroupCost
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.newRoute = data.newRoute;
            this.waitingTime = data.waitingTime;
            this.drivingTime = data.drivingTime;
            this.taskTime = data.taskTime;
            this.distance = data.distance;
        }
    }

    /**
     * The cost of a new route.
     */
    public newRoute: number;

    /**
     * The cost of every minute waiting.
     */
    public waitingTime: number;

    /**
     * The cost of every minute driving.
     */
    public drivingTime: number;

    /**
     * The cost of every minute used to load or unload.
     */
    public taskTime: number;

    /**
     * The cost of every kilometer driven.
     */
    public distance: number;
}

/**
 * Represents the settings to use when creating the routes.
 */
export class RouteCreation
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.routeTags = data.routeTags;
            this.manualApproval = data.manualApproval;
            this.routeNameTemplate = data.routeNameTemplate;
        }
        else
        {
            this.routeTags = [];
            this.manualApproval = false;
        }
    }

    /**
     * The tags that should be associate with the routes.
     */
    public routeTags: string[];

    /**
     * True if the routes must be manually approved, otherwise false.
     */
    public manualApproval: boolean;

    /**
     * The route template from which routes should be created.
     */
    public routeNameTemplate: string;
}

/**
 * Represents the restrictions that should be used during route optimization.
 */
export class Restrictions
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.ferriesAllowed = data.ferriesAllowed;
            this.privateRoadsAllowed = data.privateRoadsAllowed;
            this.highwaysAllowed = data.highwaysAllowed;
            this.uturnStrategy = new UturnStrategy(data.uturnStrategy);
            this.curbApproachStrategy = new CurbApproachStrategy(data.curbApproachStrategy);
            this.timeWindowAdjustment = new TimeWindowAdjustment(data.timeWindowAdjustment);
            this.oneRoutePlanPerStartLocation = data.oneRoutePlanPerStartLocation;
            this.maxCalculationTime = data.maxCalculationTime;
        }
        else
        {
            this.ferriesAllowed = true;
            this.privateRoadsAllowed = true;
            this.highwaysAllowed = true;
            this.uturnStrategy = new UturnStrategy("allowed");
            this.curbApproachStrategy = new CurbApproachStrategy("either-side-of-vehicle");
            this.timeWindowAdjustment = new TimeWindowAdjustment();
            this.oneRoutePlanPerStartLocation = true;
        }
    }

    /**
     * True to allow ferries, otherwise false.
     */
    public ferriesAllowed: boolean;

    /**
     * True to allow private routes, otherwise false.
     */
    public privateRoadsAllowed: boolean;

    /**
     * True to allow highways, otherwise false.
     */
    public highwaysAllowed: boolean;

    /**
     * The U-turn strategy to use.
     */
    public uturnStrategy: UturnStrategy;

    /**
     * The curb-approach strategy to use.
     */
    public curbApproachStrategy: CurbApproachStrategy;

    /**
     * The time window adjustments allowed during optimization,
     * in order to save cost or improve quality.
     */
    public timeWindowAdjustment: TimeWindowAdjustment;

    /**
     * True to produce one route plan per start location, otherwise false.
     */
    public oneRoutePlanPerStartLocation: boolean;

    /**
     * The timeout to use when calculating a route plan.
     */
    public maxCalculationTime: Duration;
}

/**
 * Represents the arrival time window adjustments that are allowed,
 * in order to save cost or improve quality.
 */
export class TimeWindowAdjustment
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.start = data.start;
            this.end = data.end;
        }
    }

    /**
     * The max adjustment allowed for the earliest arrival time of the time window.
     */
    public start: number;

    /**
     * The max adjustment allowed for the latest arrival time of the time window.
     */
    public end: number;
}
