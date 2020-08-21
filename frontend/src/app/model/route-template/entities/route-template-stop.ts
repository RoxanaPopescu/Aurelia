import { TimeRange } from "shared/types/index";
import { Location } from "app/model/shared";
import { RouteStopType } from "app/model/route";
import { Contact } from "app/model/shared/entities/contact";
import clone from "clone";

/**
 * Represents a stop defined in a route template.
 */
export class RouteTemplateStop
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any, stopNumber?: number)
    {
        if (data != null)
        {
            this.location = new Location(data.location);
            this.type = new RouteStopType(data.type);
            this.contact = new Contact(data.contact);
            this.tasks = data.tasks;
            this.driverInstructions = data.driverInstructions;
            this.gate = data.gate;
            this.arrivalTimeFrame = new TimeRange(data.arrivalTimeFrame);
            this.id = data.id;
        }
        else
        {
            this.location = new Location();
            this.contact = new Contact();
            this.tasks = [];
            this.arrivalTimeFrame = new TimeRange();
        }

        if (stopNumber != null)
        {
            this.stopNumber = stopNumber;
        }
    }

    /**
     * The ID of the route template stop.
     */
    public id: string;

    /**
     * The number this stop has on the route.
     */
    public stopNumber: number;

    /**
     * The location of the stop.
     */
    public location: Location;

    /**
     * The type of the stop.
     */
    public type: RouteStopType;

    /**
     * The contact associated witht the stop.
     */
    public contact: Contact;

    /**
     * The driver tasks associated with the stop.
     */
    public tasks: any[];

    /**
     * The instructions associated with the stop.
     */
    public driverInstructions: string | undefined;

    /**
     * The gate the driver should use, if any.
     */
    public gate: number | undefined;

    /**
     * The time frame within which the driver is should arrive at the stop.
     */
    public arrivalTimeFrame: TimeRange | undefined;

    /**
     * Gets the localized names of the active requirements.
     */
    /*
    public get activeRequirementNames(): string[]
    {
        return Object.keys(this.requirements).filter(key => this.requirements[key]).map(key => requirementNames[key]);
    }
    */

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            id: this.id,
            location: this.location,
            type: this.type.slug,
            contact: this.contact,
            tasks: this.tasks,
            driverInstructions: this.driverInstructions,
            gate: this.gate,
            arrivalTimeFrame: this.arrivalTimeFrame
        };
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}
